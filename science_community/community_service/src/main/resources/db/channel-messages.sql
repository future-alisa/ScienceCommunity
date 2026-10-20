CREATE TABLE IF NOT EXISTS tb_channel_message (
  sequence_id BIGINT NOT NULL AUTO_INCREMENT,
  message_id CHAR(32) NOT NULL,
  channel_id CHAR(32) NOT NULL,
  sender_id CHAR(32) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  client_message_id VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (sequence_id),
  UNIQUE KEY uk_channel_message_id (message_id),
  UNIQUE KEY uk_channel_message_request (channel_id, sender_id, client_message_id),
  KEY idx_channel_message_history (channel_id, sequence_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
