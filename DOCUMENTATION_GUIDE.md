# Documentation Guide - Which Files Are For What

This project contains several markdown documentation files. Here's what each one is for:

## 📋 Core Documentation (READ THESE)

### README.md
**Who it's for:** Anyone getting started with the project  
**Purpose:** Main project overview, quick start guide, feature list, deployment instructions  
**When to read:** First time setting up the project, need quick reference  
**Status:** Always up-to-date with latest implementation

### PRD.md (Product Requirements Document)
**Who it's for:** Developers and stakeholders  
**Purpose:** Complete feature specifications, design system, color palette, typography, animations  
**When to read:** Understanding what's implemented, design decisions, feature requirements  
**Status:** Updated when new features are added or design changes are made

## 🔧 ESP32 Integration Guides

### EXPORT_SOLUTION.md
**Who it's for:** Users deciding between vanilla vs React build export  
**Purpose:** Detailed comparison of export options, pros/cons, recommendations  
**When to read:** Before exporting for ESP32, deciding which export method to use  
**Status:** Reference guide - explains the "why" behind two export options

### ESP32_CONVERSION_GUIDE.md
**Who it's for:** Developers manually converting React code to vanilla JS  
**Purpose:** Step-by-step examples of React → Vanilla JS conversion  
**When to read:** Manually porting features, understanding how vanilla export works  
**Status:** Reference guide with code examples

### VANILLA_EXPORT_IMPROVEMENTS.md
**Who it's for:** Developers improving the vanilla export implementation  
**Purpose:** Technical guide on making vanilla export match React version more closely  
**When to read:** Enhancing vanilla export CSS/JS, troubleshooting visual differences  
**Status:** Reference guide with implementation tips

## 🤖 AI Prompt Files (FOR CLAUDE/AI ASSISTANTS)

### CLAUDE_PROMPT_REACT_BUILD_EXPORT.md
**Who it's for:** AI assistants (Claude, GPT, etc.) or developers using AI for implementation  
**Purpose:** Detailed prompt for implementing full React build export functionality  
**When to read:** You want AI to implement React build export from scratch  
**Status:** ✅ **IMPLEMENTED** - This functionality is now complete in the app  
**Note:** You don't need this anymore unless you want to re-implement or modify the React build export

## 📊 File Status Summary

| File | Status | For Humans | For AI | Updated Regularly |
|------|--------|------------|--------|-------------------|
| README.md | ✅ Current | ✓ | ✓ | Yes |
| PRD.md | ✅ Current | ✓ | ✓ | Yes |
| EXPORT_SOLUTION.md | ✅ Complete | ✓ | ✓ | Rarely |
| ESP32_CONVERSION_GUIDE.md | ✅ Complete | ✓ | ✓ | Rarely |
| VANILLA_EXPORT_IMPROVEMENTS.md | ✅ Complete | ✓ | ✓ | Rarely |
| CLAUDE_PROMPT_REACT_BUILD_EXPORT.md | ✅ Implemented | ✗ | ✓ | No (feature done) |
| DOCUMENTATION_GUIDE.md | ✅ Current | ✓ | ✓ | As needed |

## 🎯 Quick Reference: What Should I Read?

**I want to get started developing:**
→ Read **README.md** (Development Commands section)

**I want to understand what features exist:**
→ Read **README.md** (Implementation Status) and **PRD.md** (Essential Features)

**I want to export to ESP32:**
→ Use the app's "Export for ESP32" button, then read downloaded README  
→ Or read **EXPORT_SOLUTION.md** to understand your options

**I want to manually convert React to vanilla JS:**
→ Read **ESP32_CONVERSION_GUIDE.md**

**I want to improve the vanilla export to match React better:**
→ Read **VANILLA_EXPORT_IMPROVEMENTS.md**

**I'm Claude/GPT and need to implement React build export:**
→ Read **CLAUDE_PROMPT_REACT_BUILD_EXPORT.md**  
→ But note: This feature is already implemented! Check ExportButton.tsx

**I need to see the design system (colors, fonts, etc.):**
→ Read **PRD.md** (Color Selection, Font Selection, Component Selection)

## 🔄 Maintenance Notes

### When to update each file:

**README.md** - Update when:
- New features are added
- Export functionality changes
- Development commands change
- Project structure changes

**PRD.md** - Update when:
- New features are implemented
- Design system changes
- Edge cases are discovered
- Feature status changes

**EXPORT_SOLUTION.md** - Update when:
- Export options change significantly
- New export method is added
- Storage requirements change

**ESP32_CONVERSION_GUIDE.md** - Update when:
- Vanilla export structure changes
- New components need conversion examples
- API integration patterns change

**VANILLA_EXPORT_IMPROVEMENTS.md** - Update when:
- New techniques for improving vanilla export are discovered
- CSS/JS optimization tips are found

**CLAUDE_PROMPT_REACT_BUILD_EXPORT.md** - Update when:
- You want to re-implement React build export differently
- Build process changes significantly
- (Generally: Don't update - feature is done)

## 💡 Tips

- **Start with README.md** - It has everything you need to get started
- **PRD.md is your feature reference** - Check here to see what's implemented
- **Export guides are optional** - Only read if you're deploying to ESP32
- **AI prompts are historical** - They show how features were implemented but aren't needed for daily use
- **When in doubt, check the app** - The actual implementation is always the source of truth

## 📝 File Descriptions in One Sentence

- **README.md** - Project overview, setup, and quick reference
- **PRD.md** - Complete product requirements and design specifications  
- **EXPORT_SOLUTION.md** - Comparison guide for export options
- **ESP32_CONVERSION_GUIDE.md** - React to vanilla JS conversion examples
- **VANILLA_EXPORT_IMPROVEMENTS.md** - How to improve vanilla export quality
- **CLAUDE_PROMPT_REACT_BUILD_EXPORT.md** - AI prompt for React build (already implemented)
- **DOCUMENTATION_GUIDE.md** - This file - explains all the other files

---

**Last Updated:** Current session  
**Next Review:** When new documentation is added or major features change
