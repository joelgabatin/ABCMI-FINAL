-- ============================================================================
-- MIGRATION: Seed remaining sample testimonies
-- ============================================================================

INSERT INTO public.testimonies (author, branch, category, title, content, status, anonymous, is_member, likes, created_at) VALUES
('Renaldo Cruz', 'Dalic, Bontoc, Mt. Province', 'Healing', 'Delivered from depression', 'For two years I battled severe depression and was barely able to function. Through counseling with our pastor and the prayers of the church, God restored my mind and my joy. I am now serving in the music ministry and I am truly free.', 'pending', false, true, 0, NOW() - INTERVAL '16 days'),
('Leticia Gomez', 'San Juan, Abra', 'Answered Prayer', 'Estranged family reunited', 'A family rift that had lasted 11 years was healed this month. God softened hearts, forgiveness was exchanged, and we gathered together for the first time in over a decade. All things are possible with God.', 'hidden', false, true, 12, NOW() - INTERVAL '20 days'),
('Dionisio Balangyao', 'Patiacan, Quirino, Ilocos Sur', 'Deliverance', 'Freedom from years of bondage', 'God broke chains that had held me and my household for generations. Through prayer, fasting, and the authority of Christ, our family experienced true spiritual freedom. We are now stronger in faith than ever before.', 'approved', false, true, 27, NOW() - INTERVAL '25 days');
