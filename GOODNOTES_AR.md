# GoodNotes-style Arabic Study Build

This fork is the working base for a fast iPad handwritten-notes app for Arabic/English study.

## Product goals
- Native Apple Pencil handwriting and PDF annotation.
- Fast large-PDF navigation with visible-page canvas virtualization.
- Arabic-first study workflow while retaining English support.
- English ↔ Arabic translation for selected/recognized text using Apple's on-device translation where available.
- OCR/search, handwriting-to-text, folders, notebooks, export and autosave.
- No subscription, ads, or tracking.

## Build
This branch intentionally preserves the upstream OwlLuna architecture so existing performance, PDF, PencilKit, OCR, export, sync and translation features remain intact while the Arabic UI/product layer is developed.

Requires Xcode 27+ and iPadOS 18+. For device signing, copy `Config/Signing.local.xcconfig.example` to `Config/Signing.local.xcconfig` and set your own team/bundle prefix.

## Upstream
Based on OwlLuna (MIT). See `LICENSE` and upstream documentation retained in the repository.
