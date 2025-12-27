CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    lead_source VARCHAR(100),

    first_name VARCHAR(100),
    last_name VARCHAR(100),
    designation VARCHAR(100),
    organization VARCHAR(150),

    email VARCHAR(150),
    mobile VARCHAR(20),
    telephone VARCHAR(20),
    fax VARCHAR(20),

    address1 TEXT,
    address2 TEXT,
    country VARCHAR(100),
    zipcode VARCHAR(20),

    product_group VARCHAR(100),
    customer_group VARCHAR(100),

    deal_size NUMERIC(12,2),
    potential VARCHAR(150),

    lead_stage VARCHAR(50), 
    -- new | contacted | qualified | proposal | won | lost

    assigned_to VARCHAR(150), -- user_id from MASTER DB

    created_by VARCHAR(150),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE lead_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    note TEXT,
    created_by VARCHAR(150),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE lead_followups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

    assigned_to VARCHAR(150),
    next_followup_date TIMESTAMP,

    repeat_followup BOOLEAN DEFAULT false,
    repeat_followup_type VARCHAR(20),
    -- daily | weekly | monthly

    do_not_followup BOOLEAN DEFAULT false,

    created_by VARCHAR(150),
    created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE lead_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

    file_type VARCHAR(20),
    -- image | document | camera

    file_name TEXT,
    file_path TEXT,

    uploaded_by VARCHAR(150),
    uploaded_at TIMESTAMP DEFAULT now()
);


CREATE TABLE callbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id),
    scheduled_at TIMESTAMP,
    created_by UUID,
    status VARCHAR(20) DEFAULT 'pending'
);


CREATE TABLE productgroups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE customergroups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);
