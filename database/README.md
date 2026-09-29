# Database Configuration & Setup Guide

This directory contains database configuration files, initial schema scripts, and verification instructions for PostgreSQL.

## Environment Variables

Database connectivity parameters are managed using standard `.env` configuration:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smart_edu_db
```

## Running Local PostgreSQL Database

### Option A: Local PostgreSQL Server
1. Create database `smart_edu_db`:
   ```sql
   CREATE DATABASE smart_edu_db;
   ```
2. Execute `init.sql`:
   ```bash
   psql -U postgres -d smart_edu_db -f database/init.sql
   ```

### Option B: Docker Container
Using `docker-compose` from the project root:
```bash
docker-compose -f docker/docker-compose.yml up postgres
```
