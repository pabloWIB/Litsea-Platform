CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION current_employee_id()
RETURNS UUID AS $$
  SELECT id FROM employees WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees              ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects               ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_log_employees     ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports          ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_documents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transfers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: read own row"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users: admin full access"
  ON users FOR ALL
  USING (current_user_role() = 'admin');

CREATE POLICY "employees: read own record"
  ON employees FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "employees: manager and admin read all"
  ON employees FOR SELECT
  USING (current_user_role() IN ('manager', 'admin'));

CREATE POLICY "employees: admin write"
  ON employees FOR INSERT
  WITH CHECK (current_user_role() = 'admin');

CREATE POLICY "employees: admin update"
  ON employees FOR UPDATE
  USING (current_user_role() = 'admin');

CREATE POLICY "employees: admin delete"
  ON employees FOR DELETE
  USING (current_user_role() = 'admin');


CREATE POLICY "employee_documents: read own"
  ON employee_documents FOR SELECT
  USING (
    employee_id = current_employee_id()
    OR current_user_role() IN ('manager', 'admin')
  );

CREATE POLICY "employee_documents: manager and admin write"
  ON employee_documents FOR ALL
  USING (current_user_role() IN ('manager', 'admin'));


CREATE POLICY "projects: all authenticated users can read"
  ON projects FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "projects: admin write"
  ON projects FOR INSERT
  WITH CHECK (current_user_role() = 'admin');

CREATE POLICY "projects: admin update"
  ON projects FOR UPDATE
  USING (current_user_role() = 'admin');

CREATE POLICY "projects: admin delete"
  ON projects FOR DELETE
  USING (current_user_role() = 'admin');


CREATE POLICY "time_logs: employee reads own entries"
  ON time_logs FOR SELECT
  USING (
    current_user_role() IN ('manager', 'admin')
    OR EXISTS (
      SELECT 1 FROM time_log_employees tle
      WHERE tle.time_log_id = id
        AND tle.employee_id = current_employee_id()
    )
  );

CREATE POLICY "time_logs: manager and admin write"
  ON time_logs FOR ALL
  USING (current_user_role() IN ('manager', 'admin'));


CREATE POLICY "time_log_employees: read"
  ON time_log_employees FOR SELECT
  USING (
    current_user_role() IN ('manager', 'admin')
    OR employee_id = current_employee_id()
  );

CREATE POLICY "time_log_employees: manager and admin write"
  ON time_log_employees FOR ALL
  USING (current_user_role() IN ('manager', 'admin'));


CREATE POLICY "daily_reports: employee reads and writes own"
  ON daily_reports FOR SELECT
  USING (
    employee_id = current_employee_id()
    OR current_user_role() IN ('manager', 'admin')
  );

CREATE POLICY "daily_reports: employee insert"
  ON daily_reports FOR INSERT
  WITH CHECK (
    employee_id = current_employee_id()
    OR current_user_role() IN ('manager', 'admin')
  );

CREATE POLICY "daily_reports: update own or manager review"
  ON daily_reports FOR UPDATE
  USING (
    employee_id = current_employee_id()
    OR current_user_role() IN ('manager', 'admin')
  );


CREATE POLICY "leave_requests: employee reads own"
  ON leave_requests FOR SELECT
  USING (
    employee_id = current_employee_id()
    OR current_user_role() IN ('manager', 'admin')
  );

CREATE POLICY "leave_requests: employee submits own"
  ON leave_requests FOR INSERT
  WITH CHECK (
    employee_id = current_employee_id()
    OR current_user_role() IN ('manager', 'admin')
  );

CREATE POLICY "leave_requests: manager and admin update"
  ON leave_requests FOR UPDATE
  USING (current_user_role() IN ('manager', 'admin'));


CREATE POLICY "leave_documents: read own or manager"
  ON leave_documents FOR SELECT
  USING (
    current_user_role() IN ('manager', 'admin')
    OR EXISTS (
      SELECT 1 FROM leave_requests lr
      WHERE lr.id = leave_request_id
        AND lr.employee_id = current_employee_id()
    )
  );

CREATE POLICY "leave_documents: write own or manager"
  ON leave_documents FOR ALL
  USING (
    current_user_role() IN ('manager', 'admin')
    OR EXISTS (
      SELECT 1 FROM leave_requests lr
      WHERE lr.id = leave_request_id
        AND lr.employee_id = current_employee_id()
    )
  );


CREATE POLICY "assets: manager and admin read"
  ON assets FOR SELECT
  USING (current_user_role() IN ('manager', 'admin'));

CREATE POLICY "assets: manager and admin write"
  ON assets FOR ALL
  USING (current_user_role() IN ('manager', 'admin'));


CREATE POLICY "asset_transfers: manager and admin"
  ON asset_transfers FOR ALL
  USING (current_user_role() IN ('manager', 'admin'));

-- ─── asset_maintenance_logs ──────────────────────────────────────────────────

CREATE POLICY "asset_maintenance_logs: manager and admin"
  ON asset_maintenance_logs FOR ALL
  USING (current_user_role() IN ('manager', 'admin'));


CREATE POLICY "crm_contacts: rep sees own, manager sees all"
  ON crm_contacts FOR SELECT
  USING (
    assigned_to = auth.uid()
    OR current_user_role() IN ('manager', 'admin')
  );

CREATE POLICY "crm_contacts: manager and admin insert"
  ON crm_contacts FOR INSERT
  WITH CHECK (current_user_role() IN ('manager', 'admin'));

CREATE POLICY "crm_contacts: rep updates own, manager updates all"
  ON crm_contacts FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR current_user_role() IN ('manager', 'admin')
  );

CREATE POLICY "crm_contacts: admin delete only"
  ON crm_contacts FOR DELETE
  USING (current_user_role() = 'admin');


CREATE POLICY "crm_activities: read if contact is accessible"
  ON crm_activities FOR SELECT
  USING (
    current_user_role() IN ('manager', 'admin')
    OR EXISTS (
      SELECT 1 FROM crm_contacts c
      WHERE c.id = contact_id
        AND c.assigned_to = auth.uid()
    )
  );

CREATE POLICY "crm_activities: insert if contact is accessible"
  ON crm_activities FOR INSERT
  WITH CHECK (
    current_user_role() IN ('manager', 'admin')
    OR EXISTS (
      SELECT 1 FROM crm_contacts c
      WHERE c.id = contact_id
        AND c.assigned_to = auth.uid()
    )
  );
