INSERT INTO users (name, email, password)
VALUES ('Michael Jordan', 'jordan@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dennis Rodman', 'rodman@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Steve Kerr', 'kerr@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'message', 'message', 'message', 'message', 100, 1, 1, 1, 'Canada', 'Parker Drive', 'Oakville','Ontario', 'l5l5b9', TRUE),
(2, 'message', 'message', 'message', 'message', 150, 3, 1, 2, 'USA', 'Parade Drive', 'Palmer Drive','California', '90210', TRUE),
(3, 'message', 'message', 'message', 'message', 300, 5, 6, 7, 'USA', 'Beverly Hills', 'Rodeo Drive','California', '90210', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2023-01-11', '2023-01-15', 2, 1),
('2023-02-13', '2023-02-20', 1, 2),
('2023-02-01', '2023-02-02', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 3, 9, 'message'),
(2, 3, 2, 8, 'message'),
(3, 1, 1, 7.5, 'message');