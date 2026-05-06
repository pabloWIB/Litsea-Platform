CREATE TYPE user_role         AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE employment_type   AS ENUM ('full_time', 'part_time', 'contractor');
CREATE TYPE employee_status   AS ENUM ('active', 'inactive');
CREATE TYPE project_status    AS ENUM ('active', 'inactive');
CREATE TYPE report_status     AS ENUM ('draft', 'submitted', 'approved', 'revision_requested');
CREATE TYPE leave_type        AS ENUM ('annual', 'sick_paid', 'sick_unpaid', 'unpaid', 'other');
CREATE TYPE leave_status      AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE asset_status      AS ENUM ('in_warehouse', 'assigned_to_project', 'assigned_to_employee', 'under_maintenance', 'retired');
CREATE TYPE asset_location    AS ENUM ('warehouse', 'project', 'employee', 'maintenance', 'retired');
CREATE TYPE crm_stage         AS ENUM ('lead', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost');
CREATE TYPE activity_type     AS ENUM ('note', 'call', 'meeting', 'email');

CREATE TABLE users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT NOT NULL UNIQUE,
  password_hash    TEXT,                          
  name             TEXT NOT NULL,
  role             user_role NOT NULL DEFAULT 'employee',
  avatar_url       TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE employees (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID REFERENCES users(id) ON DELETE SET NULL,

  first_name              TEXT NOT NULL,
  last_name               TEXT NOT NULL,
  email                   TEXT NOT NULL UNIQUE,
  phone                   TEXT,
  profile_photo_url       TEXT,

  nationality             TEXT,
  passport_number         TEXT,
  resident_id_type        TEXT,                  
  resident_id_number      TEXT,

  department              TEXT,
  job_title               TEXT,
  employment_type         employment_type NOT NULL DEFAULT 'full_time',
  hire_date               DATE,
  office_location         TEXT,
  salary                  NUMERIC(12, 2),
  manager_id              UUID REFERENCES employees(id) ON DELETE SET NULL,
  status                  employee_status NOT NULL DEFAULT 'active',

  annual_leave_allowance  INT NOT NULL DEFAULT 25,
  vacation_days_used      INT NOT NULL DEFAULT 0,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE employee_documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  file_url      TEXT NOT NULL,
  uploaded_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  contractor_name   TEXT,
  description       TEXT,
  item_description  TEXT,
  status            project_status NOT NULL DEFAULT 'active',
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE time_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date              DATE NOT NULL,
  start_time        TIME NOT NULL,
  end_time          TIME NOT NULL,
  break_minutes     INT NOT NULL DEFAULT 0,
  project_id        UUID REFERENCES projects(id) ON DELETE SET NULL,
  item_description  TEXT,
  is_contractor     BOOLEAN NOT NULL DEFAULT false,
  created_by        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE time_log_employees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_log_id   UUID NOT NULL REFERENCES time_logs(id) ON DELETE CASCADE,
  employee_id   UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE (time_log_id, employee_id)
);



CREATE TABLE daily_reports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id         UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  time_log_id         UUID REFERENCES time_logs(id) ON DELETE SET NULL,
  project_id          UUID REFERENCES projects(id) ON DELETE SET NULL,

  activities_done     TEXT,
  achievements        TEXT,
  blockers            TEXT,
  next_steps          TEXT,
  additional_notes    TEXT,

  status              report_status NOT NULL DEFAULT 'draft',
  submitted_at        TIMESTAMPTZ,
  reviewed_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewer_comment    TEXT,
  reviewed_at         TIMESTAMPTZ,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE leave_requests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id         UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type          leave_type NOT NULL,
  start_date          DATE NOT NULL,
  end_date            DATE NOT NULL,
  reason              TEXT,
  status              leave_status NOT NULL DEFAULT 'pending',
  reviewed_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewer_comment    TEXT,
  reviewed_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leave_documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leave_request_id    UUID NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  file_url            TEXT NOT NULL,
  uploaded_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE assets (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  serial_number         TEXT NOT NULL UNIQUE,
  category              TEXT,
  purchase_date         DATE,
  status                asset_status NOT NULL DEFAULT 'in_warehouse',
  current_project_id    UUID REFERENCES projects(id) ON DELETE SET NULL,
  current_employee_id   UUID REFERENCES employees(id) ON DELETE SET NULL,
  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE asset_transfers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id              UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  from_location         asset_location NOT NULL,
  from_project_id       UUID REFERENCES projects(id) ON DELETE SET NULL,
  from_employee_id      UUID REFERENCES employees(id) ON DELETE SET NULL,
  to_location           asset_location NOT NULL,
  to_project_id         UUID REFERENCES projects(id) ON DELETE SET NULL,
  to_employee_id        UUID REFERENCES employees(id) ON DELETE SET NULL,
  delivery_note_url     TEXT,
  notes                 TEXT,
  transferred_by        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  transferred_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE asset_maintenance_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id      UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  date          DATE NOT NULL,
  cost          NUMERIC(10, 2),
  description   TEXT NOT NULL,
  technician    TEXT,
  document_url  TEXT,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE crm_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  company         TEXT,
  email           TEXT,
  phone           TEXT,
  country         TEXT,
  pipeline_stage  crm_stage NOT NULL DEFAULT 'lead',
  assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crm_activities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id    UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  type          activity_type NOT NULL,
  content       TEXT NOT NULL,
  created_by    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX idx_employees_user_id      ON employees(user_id);
CREATE INDEX idx_employees_manager_id   ON employees(manager_id);
CREATE INDEX idx_employees_department   ON employees(department);
CREATE INDEX idx_employees_status       ON employees(status);

CREATE INDEX idx_time_logs_date         ON time_logs(date);
CREATE INDEX idx_time_logs_project_id   ON time_logs(project_id);
CREATE INDEX idx_time_log_employees_emp ON time_log_employees(employee_id);

CREATE INDEX idx_daily_reports_employee ON daily_reports(employee_id);
CREATE INDEX idx_daily_reports_status   ON daily_reports(status);

CREATE INDEX idx_leave_employee_id      ON leave_requests(employee_id);
CREATE INDEX idx_leave_status           ON leave_requests(status);

CREATE INDEX idx_assets_serial          ON assets(serial_number);
CREATE INDEX idx_assets_status          ON assets(status);
CREATE INDEX idx_asset_transfers_asset  ON asset_transfers(asset_id);

CREATE INDEX idx_crm_contacts_assigned  ON crm_contacts(assigned_to);
CREATE INDEX idx_crm_contacts_stage     ON crm_contacts(pipeline_stage);
CREATE INDEX idx_crm_activities_contact ON crm_activities(contact_id);



CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_time_logs_updated_at
  BEFORE UPDATE ON time_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_daily_reports_updated_at
  BEFORE UPDATE ON daily_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_leave_requests_updated_at
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_crm_contacts_updated_at
  BEFORE UPDATE ON crm_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
