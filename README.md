# Co-Viewer PDF Sync

A collaborative PDF viewer that allows multiple users to view and control the same PDF document in real-time. This project enables synchronized PDF navigation between an admin and other viewers using WebSockets (Socket.IO).

## Features

- **Real-time PDF Sync**: Admin can control the PDF navigation, and all connected viewers will see the same page.
- **Admin Control**: Only the admin has permission to change the PDF pages.
- **Automatic Admin Reassignment**: When the admin disconnects, another user is automatically assigned as the new admin.
- **Error Handling**: Handles errors in loading the PDF and connection issues.

## Technology Stack

- **Frontend**: React, Socket.IO-Client, React-PDF Viewer
- **Backend**: Node.js, Express, Socket.IO, Redis
- **Deployment**: Docker, GitHub

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RAMANA-JSRA/Co-Viewer-PDF-Sync.git
   cd Co-Viewer-PDF-Sync
