-- Smart Education & Student Guidance Platform
-- Database Initialization Script (Phase 1 Foundation)

CREATE DATABASE smart_edu_db;

\c smart_edu_db;

-- System Metadata & Schema Marker Table
CREATE TABLE IF NOT EXISTS system_metadata (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_metadata (key, value) VALUES
    ('schema_version', '1.0.0-phase1'),
    ('platform_name', 'Smart Education Platform')
ON CONFLICT (key) DO NOTHING;

-- Verification query
SELECT * FROM system_metadata;
