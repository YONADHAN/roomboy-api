# Roomboy API

## Project Overview
The backend API for the Roomboy application, designed to manage property and room data. It serves as the unified data source and validation engine for the Admin Panel.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Validation**: Zod
- **Language**: TypeScript

## Core Concepts

### Dynamic Field Definitions
The system does not strictly hardcode property attributes definition in the Mongoose schema. Instead, attributes are validated against a "Field Definition" collection at runtime. This allows admins to define new fields (e.g., "Has Pool") without backend code changes.

### Validation Flow (Important)
1. **Fetch**: `FieldDefinitions` for the entity (e.g., 'property').
2. **Validate**: Loop through incoming data and check against defined rules (required, dataType, min/max, options).
3. **Reject/Sanitize**: Invalid fields are rejected; only defined attributes are persisted.
4. **Storage**: stored in a flexible `attributes` field or mixed schema structure.

## Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or Atlas)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Create a `.env` file in this directory with your configuration:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/roomboy
   # Add other secrets as needed
   ```

3. Start Development Server:
   ```bash
   npm run dev
   ```
   The API will run at `http://localhost:3000`.

## Folder Structure
```
api/
├── src/
│   ├── controllers/  # Request Handlers
│   ├── models/       # Mongoose Models (Base & Dynamic Schemas)
│   ├── routes/       # Express Routes
│   ├── services/     # Business Logic & Dynamic Validation Service
│   └── utils/        # Helpers & Zod Schemas
└── package.json
```
