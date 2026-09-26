-- =============================================================================
-- CAPITAL AI — PIPELINE BUILDER & MULTI-ASSET INTELLIGENCE PLATFORM
-- SQL MIGRATION: 20260926000000_capital_ai_pipeline_builder_schema.sql
-- SYSTEM OF RECORD: Supabase / PostgreSQL Relational Schema & Multi-Tenant RLS
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. HELPER FUNCTIONS & TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper to check workspace membership and role
CREATE OR REPLACE FUNCTION public.is_workspace_member(
  target_workspace_id UUID,
  required_role TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  IF required_role IS NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_id = target_workspace_id
        AND user_id = auth.uid()
    );
  ELSE
    RETURN EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_id = target_workspace_id
        AND user_id = auth.uid()
        AND (
          role = required_role 
          OR (required_role = 'viewer' AND role IN ('owner', 'analyst', 'viewer'))
          OR (required_role = 'analyst' AND role IN ('owner', 'analyst'))
          OR (required_role = 'owner' AND role = 'owner')
        )
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. CORE WORKSPACES & MULTI-TENANCY
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(80) NOT NULL UNIQUE,
  tier VARCHAR(40) NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard', 'pro', 'enterprise', 'institutional')),
  monthly_budget_cap_eur NUMERIC(8, 2) NOT NULL DEFAULT 40.00 CHECK (monthly_budget_cap_eur <= 1000.00),
  cpt_staking_tier VARCHAR(40) NOT NULL DEFAULT 'Tier I' CHECK (cpt_staking_tier IN ('Tier I', 'Tier II', 'Tier III')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(30) NOT NULL DEFAULT 'analyst' CHECK (role IN ('owner', 'analyst', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

CREATE TRIGGER trg_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 3. PIPELINES, NODES & EDGES (THE GRAPH DATA MODEL)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  description TEXT DEFAULT '',
  version VARCHAR(30) NOT NULL DEFAULT '1.0.0',
  lifecycle VARCHAR(40) NOT NULL DEFAULT 'draft' CHECK (
    lifecycle IN ('draft', 'validated', 'benchmarked', 'shadow', 'canary', 'production', 'deprecated', 'archived')
  ),
  execution_mode VARCHAR(40) NOT NULL DEFAULT 'research' CHECK (
    execution_mode IN ('research', 'shadow', 'paper', 'production', 'execution_eligible')
  ),
  target_asset_classes TEXT[] NOT NULL DEFAULT ARRAY['crypto']::TEXT[],
  status VARCHAR(30) NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'paused', 'error')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_pipelines_updated_at
  BEFORE UPDATE ON public.pipelines
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.pipeline_nodes (
  id VARCHAR(80) NOT NULL,
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  node_type VARCHAR(80) NOT NULL,
  category VARCHAR(40) NOT NULL CHECK (
    category IN ('ingestion', 'authority', 'transformation', 'analytics', 'reasoning', 'risk', 'backtest', 'egress')
  ),
  label VARCHAR(120) NOT NULL,
  description TEXT DEFAULT '',
  config JSONB NOT NULL DEFAULT '{}'::JSONB,
  inputs JSONB NOT NULL DEFAULT '[]'::JSONB,
  outputs JSONB NOT NULL DEFAULT '[]'::JSONB,
  position_x NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  position_y NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(30) NOT NULL DEFAULT 'valid' CHECK (status IN ('idle', 'configuring', 'valid', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (pipeline_id, id)
);

CREATE TRIGGER trg_pipeline_nodes_updated_at
  BEFORE UPDATE ON public.pipeline_nodes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.pipeline_edges (
  id VARCHAR(80) NOT NULL,
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  source_node_id VARCHAR(80) NOT NULL,
  source_port_id VARCHAR(80) NOT NULL,
  target_node_id VARCHAR(80) NOT NULL,
  target_port_id VARCHAR(80) NOT NULL,
  data_type VARCHAR(60) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (pipeline_id, id)
);

-- =============================================================================
-- 4. VERSIONING, AUDIT SNAPSHOTS & RUN LOGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.pipeline_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  version VARCHAR(30) NOT NULL,
  snapshot_bundle JSONB NOT NULL,
  data_quality_score NUMERIC(5, 2) NOT NULL CHECK (data_quality_score BETWEEN 0 AND 100),
  estimated_latency_ms NUMERIC(8, 2) NOT NULL CHECK (estimated_latency_ms > 0),
  estimated_monthly_cost_eur NUMERIC(8, 2) NOT NULL,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pipeline_id, version)
);

CREATE TABLE IF NOT EXISTS public.pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.pipeline_versions(id) ON DELETE SET NULL,
  execution_mode VARCHAR(40) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'halted_risk')),
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  ticks_processed BIGINT NOT NULL DEFAULT 0,
  avg_latency_ms NUMERIC(8, 2),
  dqs_score NUMERIC(5, 2),
  error_log TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. EVIDENCE BEFORE DECISION (AP-002: MERKLE PROOFS & CONSENSUS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.evidence_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.pipeline_runs(id) ON DELETE SET NULL,
  sha256_merkle_root CHAR(64) NOT NULL,
  merkle_leaf_hash CHAR(64) NOT NULL,
  merkle_path TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  quorum_nodes INT NOT NULL DEFAULT 3,
  consensus_price NUMERIC(16, 6),
  sequence_id BIGINT NOT NULL,
  audit_lineage_signature TEXT NOT NULL,
  validated BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. PAPER-FIRST TRADING ENGINE (AP-005: SIMULATED PORTFOLIO & ORDERS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.paper_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  initial_balance_eur NUMERIC(14, 2) NOT NULL DEFAULT 50000.00,
  current_balance_eur NUMERIC(14, 2) NOT NULL DEFAULT 50000.00,
  realized_pnl_eur NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  unrealized_pnl_eur NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_paper_portfolios_updated_at
  BEFORE UPDATE ON public.paper_portfolios
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.paper_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.paper_portfolios(id) ON DELETE CASCADE,
  pipeline_id UUID REFERENCES public.pipelines(id) ON DELETE SET NULL,
  run_id UUID REFERENCES public.pipeline_runs(id) ON DELETE SET NULL,
  symbol VARCHAR(40) NOT NULL,
  side VARCHAR(10) NOT NULL CHECK (side IN ('buy', 'sell')),
  order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('market', 'limit', 'stop_loss')),
  quantity NUMERIC(16, 8) NOT NULL CHECK (quantity > 0),
  limit_price NUMERIC(16, 6),
  executed_price NUMERIC(16, 6),
  status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (
    status IN ('pending_approval', 'submitted', 'filled', 'rejected_risk', 'cancelled')
  ),
  simulated_latency_ms INT NOT NULL DEFAULT 45,
  evidence_bundle_id UUID REFERENCES public.evidence_bundles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_paper_orders_updated_at
  BEFORE UPDATE ON public.paper_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.paper_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.paper_portfolios(id) ON DELETE CASCADE,
  symbol VARCHAR(40) NOT NULL,
  quantity NUMERIC(16, 8) NOT NULL,
  average_entry_price NUMERIC(16, 6) NOT NULL,
  current_mark_price NUMERIC(16, 6) NOT NULL,
  unrealized_pnl_eur NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (portfolio_id, symbol)
);

CREATE TRIGGER trg_paper_positions_updated_at
  BEFORE UPDATE ON public.paper_positions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 7. AUDIT TRAIL & TAMPER-EVIDENT LEDGER (AP-002, AP-004)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(80) NOT NULL,
  resource_type VARCHAR(60) NOT NULL,
  resource_id VARCHAR(80) NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  ip_hash CHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. INDEXES FOR PERFORMANCE & SCALE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_workspace ON public.pipelines(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_lifecycle ON public.pipelines(lifecycle);
CREATE INDEX IF NOT EXISTS idx_pipeline_nodes_pipeline ON public.pipeline_nodes(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_edges_pipeline ON public.pipeline_edges(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_pipeline ON public.pipeline_runs(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_evidence_bundles_root ON public.evidence_bundles(sha256_merkle_root);
CREATE INDEX IF NOT EXISTS idx_paper_orders_portfolio ON public.paper_orders(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_workspace ON public.audit_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON public.audit_events(created_at DESC);

-- =============================================================================
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Workspaces: Visible to members
CREATE POLICY "Workspaces viewable by members"
  ON public.workspaces FOR SELECT
  USING (public.is_workspace_member(id, 'viewer'));

CREATE POLICY "Workspaces editable by owners"
  ON public.workspaces FOR UPDATE
  USING (public.is_workspace_member(id, 'owner'));

-- Workspace Members
CREATE POLICY "Workspace members viewable by members"
  ON public.workspace_members FOR SELECT
  USING (public.is_workspace_member(workspace_id, 'viewer'));

CREATE POLICY "Workspace members manageable by owners"
  ON public.workspace_members FOR ALL
  USING (public.is_workspace_member(workspace_id, 'owner'));

-- Pipelines
CREATE POLICY "Pipelines viewable by workspace members"
  ON public.pipelines FOR SELECT
  USING (public.is_workspace_member(workspace_id, 'viewer'));

CREATE POLICY "Pipelines modifiable by analysts and owners"
  ON public.pipelines FOR ALL
  USING (public.is_workspace_member(workspace_id, 'analyst'));

-- Pipeline Nodes & Edges
CREATE POLICY "Pipeline nodes viewable by workspace members"
  ON public.pipeline_nodes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p
    WHERE p.id = pipeline_nodes.pipeline_id
      AND public.is_workspace_member(p.workspace_id, 'viewer')
  ));

CREATE POLICY "Pipeline nodes modifiable by analysts and owners"
  ON public.pipeline_nodes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p
    WHERE p.id = pipeline_nodes.pipeline_id
      AND public.is_workspace_member(p.workspace_id, 'analyst')
  ));

CREATE POLICY "Pipeline edges viewable by workspace members"
  ON public.pipeline_edges FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p
    WHERE p.id = pipeline_edges.pipeline_id
      AND public.is_workspace_member(p.workspace_id, 'viewer')
  ));

CREATE POLICY "Pipeline edges modifiable by analysts and owners"
  ON public.pipeline_edges FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p
    WHERE p.id = pipeline_edges.pipeline_id
      AND public.is_workspace_member(p.workspace_id, 'analyst')
  ));

-- Versions, Runs & Evidence
CREATE POLICY "Versions viewable by workspace members"
  ON public.pipeline_versions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p
    WHERE p.id = pipeline_versions.pipeline_id
      AND public.is_workspace_member(p.workspace_id, 'viewer')
  ));

CREATE POLICY "Runs viewable by workspace members"
  ON public.pipeline_runs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p
    WHERE p.id = pipeline_runs.pipeline_id
      AND public.is_workspace_member(p.workspace_id, 'viewer')
  ));

CREATE POLICY "Evidence viewable by workspace members"
  ON public.evidence_bundles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.pipelines p
    WHERE p.id = evidence_bundles.pipeline_id
      AND public.is_workspace_member(p.workspace_id, 'viewer')
  ));

-- Paper Trading
CREATE POLICY "Paper portfolios viewable by members"
  ON public.paper_portfolios FOR SELECT
  USING (public.is_workspace_member(workspace_id, 'viewer'));

CREATE POLICY "Paper portfolios manageable by analysts and owners"
  ON public.paper_portfolios FOR ALL
  USING (public.is_workspace_member(workspace_id, 'analyst'));

CREATE POLICY "Paper orders viewable by members"
  ON public.paper_orders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.paper_portfolios pp
    WHERE pp.id = paper_orders.portfolio_id
      AND public.is_workspace_member(pp.workspace_id, 'viewer')
  ));

CREATE POLICY "Paper orders manageable by analysts and owners"
  ON public.paper_orders FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.paper_portfolios pp
    WHERE pp.id = paper_orders.portfolio_id
      AND public.is_workspace_member(pp.workspace_id, 'analyst')
  ));

CREATE POLICY "Paper positions viewable by members"
  ON public.paper_positions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.paper_portfolios pp
    WHERE pp.id = paper_positions.portfolio_id
      AND public.is_workspace_member(pp.workspace_id, 'viewer')
  ));

-- Audit Events: Read-only for viewers/analysts/owners, insert-only for system
CREATE POLICY "Audit events viewable by members"
  ON public.audit_events FOR SELECT
  USING (public.is_workspace_member(workspace_id, 'viewer'));

CREATE POLICY "Audit events insertable by analysts and system"
  ON public.audit_events FOR INSERT
  WITH CHECK (public.is_workspace_member(workspace_id, 'analyst'));

-- =============================================================================
-- 10. STORAGE BUCKETS SPECIFICATION (SQL SEED)
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('pipeline-blueprints', 'pipeline-blueprints', false, 10485760, ARRAY['application/json', 'application/pdf']),
  ('evidence-proofs', 'evidence-proofs', false, 10485760, ARRAY['application/json', 'text/plain']),
  ('research-reports', 'research-reports', true, 20971520, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow authenticated read for blueprints"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'pipeline-blueprints');

CREATE POLICY "Allow authenticated upload for blueprints"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'pipeline-blueprints');
