-- =============================================================================
-- Taraaz Sample Data Seed Script
-- Creates: 3 users, 2 conversations (polis + poll), 5 opinions, 5 votes
-- Run:  PGPASSWORD=agoralocal psql -h localhost -p 5435 -U postgres -d agora \
--           -P pager=off -f services/api/scripts/seed-sample-data.sql
-- =============================================================================

BEGIN;

-- 1. Users
INSERT INTO "user" (id, username, is_site_moderator, is_imported, is_deleted,
    active_conversation_count, total_conversation_count, total_opinion_count,
    created_at, updated_at, is_site_org_admin)
VALUES
    ('aaaaaaaa-0001-0001-0001-000000000001', 'arman',     false, false, false, 2, 2, 2, NOW()-INTERVAL '7 days', NOW(), false),
    ('aaaaaaaa-0002-0002-0002-000000000002', 'nasrin',    false, false, false, 0, 0, 3, NOW()-INTERVAL '6 days', NOW(), false),
    ('aaaaaaaa-0003-0003-0003-000000000003', 'moderator', true,  false, false, 0, 0, 1, NOW()-INTERVAL '5 days', NOW(), false)
ON CONFLICT DO NOTHING;

-- 2. Conversation 1 - plain discussion (polis, no poll)
INSERT INTO conversation
    (id, slug_id, author_id, created_at, updated_at,
     last_reacted_at, opinion_count, vote_count, participant_count,
     is_indexed, is_closed, is_edited, is_importing,
     conversation_type, participation_mode,
     total_opinion_count, total_vote_count, total_participant_count,
     moderated_opinion_count, hidden_opinion_count)
OVERRIDING SYSTEM VALUE VALUES
    (1001, 'disc0001', 'aaaaaaaa-0001-0001-0001-000000000001',
     NOW()-INTERVAL '5 days', NOW(), NOW()-INTERVAL '1 hour',
     3, 5, 3, true, false, false, false,
     'polis', 'guest',
     3, 5, 3, 0, 0)
ON CONFLICT DO NOTHING;

INSERT INTO conversation_content (id, conversation_id, title, body, created_at)
OVERRIDING SYSTEM VALUE VALUES
    (2001, 1001,
     'Should Iran adopt a federal system of government?',
     'Many countries with diverse ethnic and regional populations use federal systems to balance central authority with local autonomy. Would a federal structure benefit Iran, given its diverse provinces and ethnic groups? What would be the main challenges and advantages?',
     NOW()-INTERVAL '5 days')
ON CONFLICT DO NOTHING;

UPDATE conversation SET current_content_id = 2001 WHERE id = 1001;

-- 3. Conversation 2 - with a poll
INSERT INTO conversation
    (id, slug_id, author_id, created_at, updated_at,
     last_reacted_at, opinion_count, vote_count, participant_count,
     is_indexed, is_closed, is_edited, is_importing,
     conversation_type, participation_mode,
     total_opinion_count, total_vote_count, total_participant_count,
     moderated_opinion_count, hidden_opinion_count)
OVERRIDING SYSTEM VALUE VALUES
    (1002, 'disc0002', 'aaaaaaaa-0001-0001-0001-000000000001',
     NOW()-INTERVAL '3 days', NOW(), NOW()-INTERVAL '30 minutes',
     2, 3, 2, true, false, false, false,
     'polis', 'guest',
     2, 3, 2, 0, 0)
ON CONFLICT DO NOTHING;

-- Insert conversation_content FIRST (poll_id null for now — filled below)
INSERT INTO conversation_content (id, conversation_id, title, body, created_at)
OVERRIDING SYSTEM VALUE VALUES
    (2002, 1002,
     'Quick poll: federal vs unitary government',
     'A short follow-up to the discussion above. Cast your vote and share your reasoning.',
     NOW()-INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Now insert poll referencing the conversation_content row that exists above
INSERT INTO poll
    (id, conversation_content_id, option1, option2, option3,
     option1_response, option2_response, option3_response, created_at, updated_at)
OVERRIDING SYSTEM VALUE VALUES
    (3001, 2002,
     'Yes — federal system',
     'No — keep current system',
     'Not sure / needs more study',
     12, 8, 5, NOW()-INTERVAL '3 days', NOW())
ON CONFLICT DO NOTHING;

-- Back-fill poll_id on conversation_content
UPDATE conversation_content SET poll_id = 3001 WHERE id = 2002;

UPDATE conversation SET current_content_id = 2002 WHERE id = 1002;

-- 4. Opinions on conversation 1
INSERT INTO opinion
    (id, slug_id, author_id, conversation_id,
     num_agrees, num_disagrees, num_passes, is_seed,
     created_at, updated_at, last_reacted_at)
OVERRIDING SYSTEM VALUE VALUES
    (4001, 'op000001', 'aaaaaaaa-0002-0002-0002-000000000002', 1001,
     3, 1, 0, false, NOW()-INTERVAL '4 days', NOW(), NOW()-INTERVAL '2 hours'),
    (4002, 'op000002', 'aaaaaaaa-0003-0003-0003-000000000003', 1001,
     2, 2, 1, true, NOW()-INTERVAL '3 days 12 hours', NOW(), NOW()-INTERVAL '5 hours'),
    (4003, 'op000003', 'aaaaaaaa-0001-0001-0001-000000000001', 1001,
     4, 0, 0, false, NOW()-INTERVAL '2 days', NOW(), NOW()-INTERVAL '1 hour')
ON CONFLICT DO NOTHING;

INSERT INTO opinion_content (id, opinion_id, conversation_content_id, content, created_at)
OVERRIDING SYSTEM VALUE VALUES
    (5001, 4001, 2001,
     'A federal system could give Kurdish, Baloch, and Azerbaijani regions meaningful self-governance while keeping the country united. The key is designing the revenue-sharing formula carefully.',
     NOW()-INTERVAL '4 days'),
    (5002, 4002, 2001,
     'The risk is fragmentation. Decentralization within a unitary framework (like Spain''s autonomous communities) might be a safer starting point than full federalism.',
     NOW()-INTERVAL '3 days 12 hours'),
    (5003, 4003, 2001,
     'Either path requires building trust between Tehran and the provinces first. Without that, the institutional form matters less than the political will to share power.',
     NOW()-INTERVAL '2 days')
ON CONFLICT DO NOTHING;

UPDATE opinion SET current_content_id = 5001 WHERE id = 4001;
UPDATE opinion SET current_content_id = 5002 WHERE id = 4002;
UPDATE opinion SET current_content_id = 5003 WHERE id = 4003;

-- 5. Opinions on conversation 2 (poll)
INSERT INTO opinion
    (id, slug_id, author_id, conversation_id,
     num_agrees, num_disagrees, num_passes, is_seed,
     created_at, updated_at, last_reacted_at)
OVERRIDING SYSTEM VALUE VALUES
    (4004, 'op000004', 'aaaaaaaa-0002-0002-0002-000000000002', 1002,
     5, 1, 0, false, NOW()-INTERVAL '2 days 6 hours', NOW(), NOW()-INTERVAL '3 hours'),
    (4005, 'op000005', 'aaaaaaaa-0003-0003-0003-000000000003', 1002,
     2, 3, 0, false, NOW()-INTERVAL '1 day 8 hours', NOW(), NOW()-INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

INSERT INTO opinion_content (id, opinion_id, conversation_content_id, content, created_at)
OVERRIDING SYSTEM VALUE VALUES
    (5004, 4004, 2002,
     'Voted yes. Federal does not mean weak — look at Germany or Switzerland. Strong federalism with a robust constitutional court can keep centrifugal forces in check.',
     NOW()-INTERVAL '2 days 6 hours'),
    (5005, 4005, 2002,
     'Voted no for now. The economic crisis needs solving first — structural government reform during fiscal instability historically backfires.',
     NOW()-INTERVAL '1 day 8 hours')
ON CONFLICT DO NOTHING;

UPDATE opinion SET current_content_id = 5004 WHERE id = 4004;
UPDATE opinion SET current_content_id = 5005 WHERE id = 4005;

-- 6. Votes
INSERT INTO vote (id, author_id, opinion_id, created_at, updated_at)
OVERRIDING SYSTEM VALUE VALUES
    (6001, 'aaaaaaaa-0003-0003-0003-000000000003', 4001, NOW()-INTERVAL '3 days 20 hours', NOW()),
    (6002, 'aaaaaaaa-0001-0001-0001-000000000001', 4001, NOW()-INTERVAL '3 days 18 hours', NOW()),
    (6003, 'aaaaaaaa-0002-0002-0002-000000000002', 4002, NOW()-INTERVAL '3 days',          NOW()),
    (6004, 'aaaaaaaa-0001-0001-0001-000000000001', 4002, NOW()-INTERVAL '2 days 22 hours', NOW()),
    (6005, 'aaaaaaaa-0003-0003-0003-000000000003', 4003, NOW()-INTERVAL '1 day 20 hours',  NOW())
ON CONFLICT DO NOTHING;

INSERT INTO vote_content (id, vote_id, opinion_content_id, vote, created_at)
OVERRIDING SYSTEM VALUE VALUES
    (7001, 6001, 5001, 'agree',    NOW()-INTERVAL '3 days 20 hours'),
    (7002, 6002, 5001, 'agree',    NOW()-INTERVAL '3 days 18 hours'),
    (7003, 6003, 5002, 'disagree', NOW()-INTERVAL '3 days'),
    (7004, 6004, 5002, 'agree',    NOW()-INTERVAL '2 days 22 hours'),
    (7005, 6005, 5003, 'agree',    NOW()-INTERVAL '1 day 20 hours')
ON CONFLICT DO NOTHING;

UPDATE vote SET current_content_id = 7001 WHERE id = 6001;
UPDATE vote SET current_content_id = 7002 WHERE id = 6002;
UPDATE vote SET current_content_id = 7003 WHERE id = 6003;
UPDATE vote SET current_content_id = 7004 WHERE id = 6004;
UPDATE vote SET current_content_id = 7005 WHERE id = 6005;

-- 7. Reset sequences
SELECT setval('conversation_id_seq',         (SELECT MAX(id) FROM conversation));
SELECT setval('conversation_content_id_seq', (SELECT MAX(id) FROM conversation_content));
SELECT setval('poll_id_seq',                 (SELECT MAX(id) FROM poll));
SELECT setval('opinion_id_seq',              (SELECT MAX(id) FROM opinion));
SELECT setval('opinion_content_id_seq',      (SELECT MAX(id) FROM opinion_content));
SELECT setval('vote_id_seq',                 (SELECT MAX(id) FROM vote));
SELECT setval('vote_content_id_seq',         (SELECT MAX(id) FROM vote_content));

COMMIT;

-- Verify
SELECT c.slug_id, cc.title, c.opinion_count, c.vote_count, c.conversation_type
FROM conversation c JOIN conversation_content cc ON cc.id = c.current_content_id
WHERE c.id IN (1001, 1002) ORDER BY c.id;

SELECT u.username, o.slug_id, oc.content, o.num_agrees, o.num_disagrees
FROM opinion o
JOIN "user" u ON u.id = o.author_id
JOIN opinion_content oc ON oc.id = o.current_content_id
WHERE o.conversation_id IN (1001, 1002)
ORDER BY o.created_at;
