# Azure Deployment Guide

Azure Functions + API Management 기반 Virtual Clothing Try-On 데모 배포 가이드입니다.

## 📋 사전 요구사항

1. Azure 구독 (Subscription)
2. Azure CLI 설치 (`az` 명령어)
3. Azure Functions Core Tools 설치 (`func` 명령어)
4. Node.js 18+ 설치
5. Python 3.11 설치
6. Azure OpenAI 리소스 접근 권한

## 🏗️ 아키텍처

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Static Web Apps │────▶│ API Management   │────▶│ Azure Functions  │
│    (Frontend)    │     │   (Gateway)      │     │   (Backend)      │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
                              ┌─────────────────────────────┤
                              ▼                             ▼
                    ┌──────────────────┐         ┌──────────────────┐
                    │  Azure OpenAI    │         │  Blob Storage    │
                    │  (gpt-image-1.5) │         │  (Images)        │
                    └──────────────────┘         └──────────────────┘
```

## 🚀 배포 단계

### 1. 환경 변수 설정

```bash
# 변수 설정
export RESOURCE_GROUP="rg-virtual-tryon-demo"
export LOCATION="koreacentral"
export FUNCTION_APP_NAME="func-virtual-tryon"
export STORAGE_ACCOUNT="stvirtualtryon$(date +%s)"
export APIM_NAME="apim-virtual-tryon"
export OPENAI_NAME="aoai-virtual-tryon"
export SWA_NAME="swa-virtual-tryon"
```

### 2. Azure 리소스 그룹 생성

```bash
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

### 3. Azure OpenAI 설정

```bash
# Azure OpenAI 리소스 생성
az cognitiveservices account create \
  --name $OPENAI_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "eastus" \
  --kind OpenAI \
  --sku S0

# gpt-image-1.5 모델 배포
az cognitiveservices account deployment create \
  --name $OPENAI_NAME \
  --resource-group $RESOURCE_GROUP \
  --deployment-name "gpt-image-1.5" \
  --model-name "gpt-image-1.5" \
  --model-version "latest" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name "Standard"

# API 엔드포인트 및 키 확인
export OPENAI_ENDPOINT=$(az cognitiveservices account show \
  --name $OPENAI_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.endpoint -o tsv)

export OPENAI_KEY=$(az cognitiveservices account keys list \
  --name $OPENAI_NAME \
  --resource-group $RESOURCE_GROUP \
  --query key1 -o tsv)

echo "OpenAI Endpoint: $OPENAI_ENDPOINT"
```

### 4. Storage Account 생성 (Functions용)

```bash
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS

# Blob 컨테이너 생성 (이미지 저장용)
az storage container create \
  --name clothing-images \
  --account-name $STORAGE_ACCOUNT

az storage container create \
  --name user-uploads \
  --account-name $STORAGE_ACCOUNT

az storage container create \
  --name try-on-results \
  --account-name $STORAGE_ACCOUNT
```

### 5. Azure Functions 배포

```bash
# Function App 생성
az functionapp create \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --storage-account $STORAGE_ACCOUNT \
  --consumption-plan-location $LOCATION \
  --runtime python \
  --runtime-version 3.11 \
  --functions-version 4 \
  --os-type Linux

# 환경 변수 설정
az functionapp config appsettings set \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    AZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT \
    AZURE_OPENAI_API_KEY=$OPENAI_KEY \
    AZURE_OPENAI_DEPLOYMENT_NAME=gpt-image-1.5 \
    AZURE_OPENAI_API_VERSION=2024-02-15-preview

# 코드 배포
cd backend
func azure functionapp publish $FUNCTION_APP_NAME

# Function App URL 확인
export FUNCTION_URL=$(az functionapp show \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostName -o tsv)

echo "Function App URL: https://$FUNCTION_URL"
```

### 6. Azure API Management 설정

```bash
# API Management 생성 (Consumption Tier)
az apim create \
  --name $APIM_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --publisher-name "Virtual TryOn Demo" \
  --publisher-email "admin@example.com" \
  --sku-name Consumption

# API 가져오기 (OpenAPI 명세 사용)
az apim api import \
  --resource-group $RESOURCE_GROUP \
  --service-name $APIM_NAME \
  --api-id virtual-tryon-api \
  --path "api/v1" \
  --display-name "Virtual Try-On API" \
  --service-url "https://$FUNCTION_URL/api/v1" \
  --protocols https \
  --specification-format OpenApi \
  --specification-path ./openapi.json

# CORS 정책 설정
az apim api operation create \
  --resource-group $RESOURCE_GROUP \
  --service-name $APIM_NAME \
  --api-id virtual-tryon-api \
  --url-template "/*" \
  --method OPTIONS \
  --display-name "CORS Preflight"

# Subscription 생성
az apim subscription create \
  --resource-group $RESOURCE_GROUP \
  --service-name $APIM_NAME \
  --subscription-id "demo-subscription" \
  --display-name "Demo Subscription" \
  --scope "/apis" \
  --state active

# Subscription Key 확인
export APIM_KEY=$(az apim subscription show \
  --resource-group $RESOURCE_GROUP \
  --service-name $APIM_NAME \
  --subscription-id "demo-subscription" \
  --query primaryKey -o tsv)

export APIM_URL=$(az apim show \
  --name $APIM_NAME \
  --resource-group $RESOURCE_GROUP \
  --query gatewayUrl -o tsv)

echo "API Management URL: $APIM_URL"
echo "Subscription Key: $APIM_KEY"
```

### 7. API Management CORS 정책 설정

API Management Portal에서 다음 CORS 정책을 설정합니다:

```xml
<policies>
    <inbound>
        <cors allow-credentials="true">
            <allowed-origins>
                <origin>https://your-frontend-domain.azurestaticapps.net</origin>
                <origin>http://localhost:3000</origin>
            </allowed-origins>
            <allowed-methods>
                <method>GET</method>
                <method>POST</method>
                <method>OPTIONS</method>
            </allowed-methods>
            <allowed-headers>
                <header>Content-Type</header>
                <header>Ocp-Apim-Subscription-Key</header>
            </allowed-headers>
        </cors>
        <rate-limit calls="100" renewal-period="60" />
    </inbound>
    <backend>
        <forward-request />
    </backend>
    <outbound />
    <on-error />
</policies>
```

### 8. Static Web Apps 배포 (Frontend)

```bash
# Static Web Apps 생성
az staticwebapp create \
  --name $SWA_NAME \
  --resource-group $RESOURCE_GROUP \
  --source https://github.com/your-org/virtual-clothing-try-on \
  --location $LOCATION \
  --branch main \
  --app-location "/frontend" \
  --output-location "out" \
  --login-with-github

# 환경 변수 설정
az staticwebapp appsettings set \
  --name $SWA_NAME \
  --resource-group $RESOURCE_GROUP \
  --setting-names \
    NEXT_PUBLIC_API_URL=$APIM_URL \
    NEXT_PUBLIC_APIM_SUBSCRIPTION_KEY=$APIM_KEY

# 배포 URL 확인
export SWA_URL=$(az staticwebapp show \
  --name $SWA_NAME \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostname -o tsv)

echo "Frontend URL: https://$SWA_URL"
```

### 9. GitHub Actions 설정 (CI/CD)

`.github/workflows/azure-deployment.yml`:

```yaml
name: Azure Deployment

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AZURE_FUNCTIONAPP_NAME: func-virtual-tryon
  AZURE_FUNCTIONAPP_PACKAGE_PATH: 'backend'
  PYTHON_VERSION: '3.11'

jobs:
  build-and-deploy-functions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Install dependencies
        run: |
          cd ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
          pip install -r requirements.txt --target=".python_packages/lib/site-packages"

      - name: Deploy to Azure Functions
        uses: Azure/functions-action@v1
        with:
          app-name: ${{ env.AZURE_FUNCTIONAPP_NAME }}
          package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
          scm-do-build-during-deployment: true
          enable-oryx-build: true

  # Static Web Apps는 자동으로 GitHub Actions workflow가 생성됨
```

## 🔐 시크릿 관리

### Azure Key Vault 사용 (권장)

```bash
# Key Vault 생성
az keyvault create \
  --name "kv-virtual-tryon" \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# 시크릿 저장
az keyvault secret set \
  --vault-name "kv-virtual-tryon" \
  --name "OpenAIApiKey" \
  --value $OPENAI_KEY

# Function App에 Key Vault 참조 설정
az functionapp config appsettings set \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings AZURE_OPENAI_API_KEY="@Microsoft.KeyVault(VaultName=kv-virtual-tryon;SecretName=OpenAIApiKey)"

# Function App Managed Identity 설정
az functionapp identity assign \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP

# Key Vault 접근 권한 부여
PRINCIPAL_ID=$(az functionapp identity show \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query principalId -o tsv)

az keyvault set-policy \
  --name "kv-virtual-tryon" \
  --object-id $PRINCIPAL_ID \
  --secret-permissions get list
```

## 📊 모니터링 설정

### Application Insights

```bash
# Application Insights 생성
az monitor app-insights component create \
  --app "appi-virtual-tryon" \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP \
  --application-type web

# Function App에 연결
APPINSIGHTS_KEY=$(az monitor app-insights component show \
  --app "appi-virtual-tryon" \
  --resource-group $RESOURCE_GROUP \
  --query instrumentationKey -o tsv)

az functionapp config appsettings set \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$APPINSIGHTS_KEY

# API Management에 연결
az apim logger create \
  --resource-group $RESOURCE_GROUP \
  --service-name $APIM_NAME \
  --logger-id appinsights-logger \
  --logger-type applicationInsights \
  --instrumentation-key $APPINSIGHTS_KEY
```

## 🧪 API 테스트

```bash
# Health Check
curl -X GET "https://$FUNCTION_URL/api/v1/health"

# Health Check via APIM
curl -X GET "$APIM_URL/api/v1/health" \
  -H "Ocp-Apim-Subscription-Key: $APIM_KEY"

# 의류 카탈로그 조회
curl -X GET "$APIM_URL/api/v1/clothing" \
  -H "Ocp-Apim-Subscription-Key: $APIM_KEY"

# 카테고리별 의류 조회
curl -X GET "$APIM_URL/api/v1/clothing/category/tops" \
  -H "Ocp-Apim-Subscription-Key: $APIM_KEY"

# Virtual Try-On
curl -X POST "$APIM_URL/api/v1/try-on" \
  -H "Ocp-Apim-Subscription-Key: $APIM_KEY" \
  -F "user_image=@/path/to/your/photo.jpg" \
  -F "clothing_id=1"
```

## 🧹 리소스 정리

```bash
# 전체 리소스 그룹 삭제 (주의: 모든 리소스가 삭제됩니다!)
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## 💰 예상 비용 (월간)

| 리소스 | SKU/Tier | 예상 월 비용 (USD) |
|--------|----------|-------------------|
| Azure OpenAI | S0 | 사용량 기반 (~$0.016/1K tokens) |
| Azure Functions | Consumption | $0-20 (첫 100만 실행 무료) |
| API Management | Consumption | $3.50/백만 호출 |
| Static Web Apps | Free/Standard | $0-9 |
| Blob Storage | Standard LRS | ~$2-5 |
| Key Vault | Standard | ~$0.03/10K 작업 |
| Application Insights | 사용량 기반 | ~$2-5 |
| **총계** | | **~$10-50/월** (데모 수준) |

*실제 비용은 사용량에 따라 달라질 수 있습니다.*

## 🔧 트러블슈팅

### Functions 배포 실패
```bash
# 로그 확인
az functionapp log tail \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP

# 배포 로그 확인
az functionapp deployment list \
  --name $FUNCTION_APP_NAME \
  --resource-group $RESOURCE_GROUP
```

### CORS 문제
1. API Management에서 CORS 정책 확인
2. 프론트엔드 도메인이 allowed-origins에 포함되어 있는지 확인
3. Ocp-Apim-Subscription-Key 헤더가 allowed-headers에 포함되어 있는지 확인

### Cold Start 지연
- Consumption Plan은 Cold Start가 발생할 수 있음
- Premium Plan으로 업그레이드하여 Always Ready 기능 사용 가능

## 🔗 유용한 링크

- [Azure Functions Documentation](https://learn.microsoft.com/azure/azure-functions/)
- [Azure API Management Documentation](https://learn.microsoft.com/azure/api-management/)
- [Azure Static Web Apps Documentation](https://learn.microsoft.com/azure/static-web-apps/)
- [Azure OpenAI Documentation](https://learn.microsoft.com/azure/ai-services/openai/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
