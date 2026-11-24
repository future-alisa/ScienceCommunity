CREATE TABLE IF NOT EXISTS tb_document_contribution (
  document_id CHAR(32) NOT NULL,
  license_note VARCHAR(255) NOT NULL,
  PRIMARY KEY (document_id),
  CONSTRAINT fk_contribution_document FOREIGN KEY (document_id) REFERENCES tb_document(document_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS tb_document_proposal (
  proposal_id CHAR(32) NOT NULL,
  document_id CHAR(32) NOT NULL,
  proposer_id CHAR(32) NOT NULL,
  status VARCHAR(16) NOT NULL,
  revision INT NOT NULL DEFAULT 0,
  summary VARCHAR(255) NOT NULL DEFAULT '',
  review_note VARCHAR(500) NOT NULL DEFAULT '',
  reviewer_id CHAR(32),
  base_content MEDIUMTEXT NOT NULL,
  proposed_content MEDIUMTEXT NOT NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (proposal_id),
  KEY idx_proposal_document (document_id, status, updated_at),
  KEY idx_proposal_proposer (proposer_id, updated_at),
  CONSTRAINT fk_proposal_document FOREIGN KEY (document_id) REFERENCES tb_document(document_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
