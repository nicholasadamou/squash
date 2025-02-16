# Squash 🎨 [![Run Tests](https://github.com/nicholasadamou/squash/actions/workflows/tests.yml/badge.svg)](https://github.com/nicholasadamou/squash/actions/workflows/tests.yml)

![React](https://img.shields.io/badge/React-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![framer-motion](https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![WebAssembly](https://img.shields.io/badge/-WebAssembly-654FF0?style=flat-square&logo=webassembly&logoColor=white)
![jest](https://img.shields.io/badge/-Jest-C21325?style=flat-square&logo=jest&logoColor=white)

![meta](public/meta.png)

Squash is a modern, browser-based image compression tool that leverages **WebAssembly** for high-performance image optimization. It supports multiple image formats and provides an intuitive interface for compressing images without compromising quality.

---

## ✨ Features

- 🖼️ **Multiple Image Format Support**: AVIF, JPEG (MozJPEG), JPEG XL, PNG (OxiPNG), WebP
- 🚀 **High-performance Compression**: Powered by WebAssembly codecs
- 🗂️ **Batch Processing**: Process multiple images at once
- 🔄 **Real-time Preview and Format Conversion**
- 📉 **Size Reduction Statistics**
- 📥 **Drag & Drop Interface** with Smart Queue for large files

---

## 🛠️ Technology Stack

- **React + TypeScript**: For the user interface
- **Vite**: For fast development and builds
- **WebAssembly**: For native-speed image processing
- **Tailwind CSS**: For styling
- **jSquash**: For image codec implementations
- **Framer Motion**: For animations
- **GitHub Actions**: For CI/CD
- **Jest**: For testing

---

## 📚 Architecture

Squash is built with a modular architecture that allows for easy addition of new image codecs and optimization tools. The core components are:

```mermaid
graph TD
    A[User] --> B[React UI]
    B --> C[Compression Options]
    B --> D[DropZone]
    B --> E[ImageList]
    C --> F[WebAssembly Compression]
    F --> G{Compression Codecs}
    G --> H[AVIF]
    G --> I[JPEG]
    G --> J[JPEG XL]
    G --> K[PNG]
    G --> L[WebP]
```

The **WebAssembly Compression Module** handles the loading and initialization of codecs. Each codec provides a common interface for image compression. The **React UI** manages user interactions and displays compressed images.

---

## 🛠️ Workflow Diagram

```mermaid
sequenceDiagram
    participant User
    participant DropZone
    participant CompressionEngine
    participant WASM
    participant DownloadManager
    participant ClearButton

    User ->> DropZone: Drag and drop images
    DropZone ->> CompressionEngine: Add images to queue
    CompressionEngine ->> WASM: Process images using WebAssembly
    WASM -->> CompressionEngine: Return compressed image data
    CompressionEngine ->> User: Display compressed image preview
    User ->> DownloadManager: Click "Download All"
    DownloadManager ->> User: Provide zip file with compressed images
    User ->> DownloadManager: Click "Download" on individual image
    DownloadManager ->> User: Download compressed image
    User ->> ClearButton: Click "Clear All"
    ClearButton ->> User: Clear all images
```

---

## 🔧 Component Interaction

```mermaid
graph LR
    App --> CompressionOptions
    App --> DropZone
    App --> ImageList
    App --> DownloadAll
    CompressionOptions --> QualitySelector
    DropZone --> useImageManager
    DropZone --> useImageQueue
    ImageList --> ImageListItem
    ImageListItem --> formatFileSize
    ImageListItem --> downloadImage
```

The `App` component serves as the main entry point, containing several child components:

- **CompressionOptions**: Manages output format and quality settings.
- **DropZone**: Handles drag-and-drop image uploads and queues images.
- **ImageList**: Displays a list of images.
- **DownloadAll**: Provides batch download functionality.

---

## 🔄 How Images Are Compressed

```mermaid
flowchart TD
    A[Image Selection] --> B{Validate Image}
    B -- Valid --> C[Add to Queue]
    C --> D[Decode Image using WebAssembly]
    D --> E[Compress Image]
    E --> F{Compression Successful?}
    F -- Yes --> G[Generate Compressed Image Preview]
    F -- No --> H[Display Error]
    G --> I[Download Compressed Image]
```

If an image is valid, it is added to the queue. The **WebAssembly module** decodes and compresses the image using the selected codec. If successful, a preview is generated, and the user can download the compressed image.

---

## 📊 State Management

```mermaid
stateDiagram-v2
    state App {
        state useImageManager {
            images --> setImages
            setImages --> removeImage
            setImages --> clearAllImages
        }
        state useImageQueue {
            queue --> addToQueue
            addToQueue --> processImage
            processImage --> updateStatus
        }
        useImageManager --> useImageQueue: Pass image data
    }
```

State management is handled through custom hooks:

- **useImageManager**: Manages image state (add, remove, clear).
- **useImageQueue**: Manages image compression queue and processing.

---

## 📦 CI/CD Workflow

```mermaid
flowchart TD
    A[Push or Pull Request] --> B[GitHub Actions CI]
    B --> C[Install Dependencies]
    C --> D[Run Tests]
    D --> E{Tests Passed?}
    E -- Yes --> F[Build and Deploy]
    E -- No --> G[Return Failure]
```

GitHub Actions ensures continuous integration and deployment by running tests and deploying the application on successful builds.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18 or later
- pnpm 10.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nicholasadamou/squash.git
   cd squash
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

---

## 💡 Usage

1. **Drag and Drop Images**: Upload images by dragging and dropping them into the DropZone.
2. **Select Output Format**: Choose between AVIF, JPEG, JPEG XL, PNG, and WebP.
3. **Adjust Quality**: Use the quality slider for optimal compression.
4. **Download**: Download individual images or all at once.

## 🔧 Default Quality Settings

- AVIF: 50%
- JPEG: 75%
- JPEG XL: 75%
- PNG: Lossless
- WebP: 75%

## 🙏 Acknowledgments

- [jSquash](https://github.com/jamsinclair/jSquash) for the WebAssembly image codecs
- [MozJPEG](https://github.com/mozilla/mozjpeg) for JPEG compression
- [libavif](https://github.com/AOMediaCodec/libavif) for AVIF support
- [libjxl](https://github.com/libjxl/libjxl) for JPEG XL support
- [Oxipng](https://github.com/shssoichiro/oxipng) for PNG optimization

