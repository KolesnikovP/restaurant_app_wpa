CREATE TABLE IF NOT EXISTS environment_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environment_id UUID NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(environment_id, user_id)
);

CREATE INDEX idx_env_members_env ON environment_members(environment_id);
CREATE INDEX idx_env_members_user ON environment_members(user_id);
