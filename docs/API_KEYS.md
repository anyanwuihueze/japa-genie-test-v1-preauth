# Japa Genie API Keys Documentation

## Overview
This document tracks all API keys used by the Japa Genie team for various services and integrations.

⚠️ **SECURITY WARNING**: This file is for documentation purposes only. Never commit actual API keys to public repositories. Use environment variables or secure secret management in production.

---

## Video Generation APIs

### Seedance 2.0 (ByteDance)
**Purpose**: AI video generation for UGC content, marketing videos
**Provider**: ByteDance / fal.ai
**Access Method**: Serverless API via fal.ai
**Status**: ✅ Active
**Last Updated**: 2026-03-02

**Configuration:**
```bash
export SEEDANCE_API_KEY="sk-2c45e39a4a22465398ead9435cc60732"
export SEEDANCE_ENDPOINT="https://api.fal.ai/models/fal-ai/seedance-2.0"
```

**Features:**
- Multimodal input (text, image, audio, video)
- 480p-1080p output
- Text-to-video generation
- Image-to-video generation

**Documentation:**
- Official: https://seed.bytedance.com/en/seedance2_0
- fal.ai docs: https://fal.ai/models/fal-ai/seedance-2.0

---

### Sora 2.0 (OpenAI)
**Purpose**: Advanced AI video generation
**Provider**: OpenAI
**Access Method**: API + ChatGPT Plus/Pro
**Status**: ⏸️ Limited Access (US/Canada only)
**Last Updated**: 2026-03-02

**Configuration:**
```bash
# API access pending
export OPENAI_API_KEY="[YOUR_OPENAI_KEY]"
```

**Pricing:**
- Free tier: Limited generations
- Plus: $20/month
- Pro: $200/month
- API: $0.10-$0.50/second

**Documentation:**
- https://openai.com/sora-2/

---

## Image Generation APIs

### Gemini Imagen (Google)
**Purpose**: Marketing image generation
**Provider**: Google / Vertex AI
**Status**: ✅ Active

**Configuration:**
```bash
export GEMINI_API_KEY="[YOUR_GEMINI_KEY]"
export GEMINI_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/model"
```

**Models Available:**
- imagen-4.0-generate-001

---

### OpenAI DALL-E
**Purpose**: Image generation
**Provider**: OpenAI
**Status**: ⚠️ API key mismatch (NVIDIA key configured)

**Configuration:**
```bash
export OPENAI_API_KEY="[REQUIRES_OPENAI_KEY]"
```

---

## Communication APIs

### Telegram Bot API
**Purpose**: Bot integration for group chat
**Bot**: @Angeljapageniebot
**Status**: ✅ Active

---

## Version Control

### GitHub
**Repository**: anyanwuihueze/japa-genie-test-v1-preauth
**SSH Key**: angel-achilles-integration (ed25519)
**Access**: Read/Write
**Status**: ✅ Active

---

## Key Management Best Practices

1. **Never commit keys to public repos**
2. **Use environment variables in production**
3. **Rotate keys quarterly**
4. **Monitor API usage for abuse**
5. **Use separate keys for dev/staging/production**

---

## Environment Setup Template

Create a `.env` file (never commit this!):

```bash
# Video Generation
SEEDANCE_API_KEY=sk-2c45e39a4a22465398ead9435cc60732

# Image Generation
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here

# Communications
TELEGRAM_BOT_TOKEN=your_telegram_token_here

# Git
GITHUB_TOKEN=your_github_token_here
```

---

## Contact
For key rotation or access issues, contact:
- J (Technical Lead)
- Sesan (Project Lead)

Last Updated: 2026-03-02
