-- Sample data for Water Docking Management System
-- This file contains sample data to help you get started

-- Insert sample customers
INSERT INTO customers (id, "firstName", "lastName", email, phone, address, "membershipTier", "loyaltyPoints", preferences, notes, "createdAt", "updatedAt")
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'John', 'Doe', 'john.doe@example.com', '+1234567890', '123 Marina Blvd, Miami, FL', 'GOLD', 3500, '{"dockSize": "large", "powerRequirements": "50A", "notifications": true, "preferredServices": ["power", "water", "fuel"]}', 'VIP customer, prefers morning docking', NOW(), NOW()),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Jane', 'Smith', 'jane.smith@example.com', '+1987654321', '456 Ocean Ave, Fort Lauderdale, FL', 'PLATINUM', 6200, '{"dockSize": "extra-large", "powerRequirements": "100A", "notifications": true}', 'Owns a 70ft yacht', NOW(), NOW()),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Bob', 'Johnson', 'bob.johnson@example.com', '+1122334455', '789 Coastal Dr, Key West, FL', 'SILVER', 1800, '{"dockSize": "medium", "powerRequirements": "30A"}', 'Regular visitor during summer', NOW(), NOW()),
  ('d4e5f6a7-b8c9-0123-def1-234567890123', 'Alice', 'Williams', 'alice.williams@example.com', '+1555666777', '321 Beachfront Rd, Naples, FL', 'BASIC', 450, '{"notifications": false}', 'New customer', NOW(), NOW()),
  ('e5f6a7b8-c9d0-1234-ef12-345678901234', 'Charlie', 'Brown', 'charlie.brown@example.com', '+1999888777', '654 Harbor St, Tampa, FL', 'SILVER', 2100, '{"dockSize": "medium", "powerRequirements": "50A", "preferredServices": ["power", "water"]}', 'Friendly and easy-going', NOW(), NOW());

-- Insert sample assets
INSERT INTO assets (id, name, type, identifier, description, location, status, "purchaseDate", "purchasePrice", "expectedLifespanYears", specifications, "createdAt", "updatedAt")
VALUES
  ('f6a7b8c9-d0e1-2345-f123-456789012345', 'Main Dock A', 'DOCK', 'DOCK-A01', 'Large dock for yachts up to 80ft', 'North Marina Section', 'OPERATIONAL', '2020-01-15', 45000.00, 25, '{"capacity": "80ft", "material": "Reinforced concrete", "cleats": 8}', NOW(), NOW()),
  ('a7b8c9d0-e1f2-3456-1234-567890123456', 'Main Dock B', 'DOCK', 'DOCK-B01', 'Medium dock for boats up to 50ft', 'North Marina Section', 'OPERATIONAL', '2020-01-15', 35000.00, 25, '{"capacity": "50ft", "material": "Reinforced concrete", "cleats": 6}', NOW(), NOW()),
  ('b8c9d0e1-f2a3-4567-2345-678901234567', 'Power Station 1', 'POWER_STATION', 'PWR-001', '50A and 100A power outlets', 'North Marina Section', 'OPERATIONAL', '2021-03-10', 15000.00, 15, '{"outlets50A": 4, "outlets100A": 2}', NOW(), NOW()),
  ('c9d0e1f2-a3b4-5678-3456-789012345678', 'Water System North', 'WATER_SYSTEM', 'WATER-N01', 'Freshwater supply system', 'North Marina Section', 'OPERATIONAL', '2020-05-20', 8000.00, 20, '{"capacity": "1000gal", "pressure": "60psi"}', NOW(), NOW()),
  ('d0e1f2a3-b4c5-6789-4567-890123456789', 'Fuel Station', 'FUEL_STATION', 'FUEL-001', 'Diesel and gasoline pumps', 'South Marina Section', 'MAINTENANCE_REQUIRED', '2019-08-12', 55000.00, 20, '{"dieselPumps": 2, "gasolinePumps": 2, "storage": "5000gal"}', NOW(), NOW());

-- Insert sample visits
INSERT INTO visits (id, "customerId", "checkInTime", "checkOutTime", "dockNumber", "boatName", "boatType", "serviceCharges", "servicesUsed", notes, "createdAt")
VALUES
  ('e1f2a3b4-c5d6-7890-5678-901234567890', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-01-15 08:00:00', '2024-01-17 14:00:00', 'A-15', 'Sea Breeze', 'Yacht', 450.00, '{"power": true, "water": true, "fuel": true, "waste": true}', 'Extended stay, excellent customer', NOW()),
  ('f2a3b4c5-d6e7-8901-6789-012345678901', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-01-20 09:30:00', NULL, 'A-01', 'Ocean Queen', 'Mega Yacht', 800.00, '{"power": true, "water": true, "fuel": true, "waste": true, "other": ["wifi", "concierge"]}', 'Currently docked, VIP service', NOW()),
  ('a3b4c5d6-e7f8-9012-7890-123456789012', 'c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-01-18 10:00:00', '2024-01-19 16:00:00', 'B-12', 'Wave Runner', 'Sailboat', 180.00, '{"power": true, "water": true}', 'Overnight stay', NOW());

-- Insert sample service requests
INSERT INTO service_requests (id, "customerId", "serviceType", description, status, priority, "scheduledDate", "estimatedCost", notes, "createdAt", "updatedAt")
VALUES
  ('b4c5d6e7-f8a9-0123-8901-234567890123', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Dock Repair', 'Need to replace cleats on dock A-15', 'IN_PROGRESS', 'HIGH', '2024-01-25 10:00:00', 350.00, 'Customer reported loose cleats', NOW(), NOW()),
  ('c5d6e7f8-a9b0-1234-9012-345678901234', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Power Upgrade', 'Need 100A power connection', 'COMPLETED', 'MEDIUM', '2024-01-22 14:00:00', 500.00, 'Completed successfully', NOW(), NOW()),
  ('d6e7f8a9-b0c1-2345-0123-456789012345', 'd4e5f6a7-b8c9-0123-def1-234567890123', 'Fuel Service', 'Request for diesel refueling', 'PENDING', 'LOW', '2024-01-28 11:00:00', 150.00, 'Scheduled for morning', NOW(), NOW());

-- Insert sample feedback
INSERT INTO feedback (id, "customerId", category, rating, comments, "sentimentScore", reviewed, "staffResponse", "createdAt")
VALUES
  ('e7f8a9b0-c1d2-3456-1234-567890123456', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'SERVICE_QUALITY', 5, 'Excellent service! The staff was very helpful and professional.', 5, true, 'Thank you for your kind words! We appreciate your business.', NOW()),
  ('f8a9b0c1-d2e3-4567-2345-678901234567', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'FACILITIES', 4, 'Great facilities, but could use better lighting at night.', 4, true, 'Thank you for the feedback. We will look into improving the lighting.', NOW()),
  ('a9b0c1d2-e3f4-5678-3456-789012345678', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'STAFF', 5, 'Outstanding staff! Very knowledgeable and friendly.', 5, false, NULL, NOW()),
  ('b0c1d2e3-f4a5-6789-4567-890123456789', 'd4e5f6a7-b8c9-0123-def1-234567890123', 'PRICING', 3, 'Services are good but a bit pricey compared to other marinas.', 3, false, NULL, NOW());

-- Insert sample maintenance records
INSERT INTO maintenance_records (id, "assetId", type, title, description, status, "scheduledDate", "completedDate", "assignedTo", "estimatedCost", "actualCost", "workPerformed", "partsReplaced", "laborHours", notes, "createdAt", "updatedAt")
VALUES
  ('c1d2e3f4-a5b6-7890-5678-901234567890', 'f6a7b8c9-d0e1-2345-f123-456789012345', 'ROUTINE', 'Quarterly Dock Inspection', 'Inspect all cleats, bolts, and structural integrity', 'COMPLETED', '2024-01-10 09:00:00', '2024-01-10 12:00:00', 'Mike Johnson', 300.00, 275.00, 'Inspected all components, tightened 4 bolts, replaced 1 cleat', '1x Stainless steel cleat', 3, 'All systems in good condition', NOW(), NOW()),
  ('d2e3f4a5-b6c7-8901-6789-012345678901', 'b8c9d0e1-f2a3-4567-2345-678901234567', 'PREVENTIVE', 'Power Station Maintenance', 'Check all electrical connections and outlets', 'SCHEDULED', '2024-01-30 10:00:00', NULL, 'Tom Williams', 400.00, NULL, NULL, NULL, NULL, 'Annual preventive maintenance', NOW(), NOW()),
  ('e3f4a5b6-c7d8-9012-7890-123456789012', 'd0e1f2a3-b4c5-6789-4567-890123456789', 'CORRECTIVE', 'Fuel Pump Repair', 'Diesel pump #1 not working properly', 'IN_PROGRESS', '2024-01-26 08:00:00', NULL, 'Sarah Davis', 800.00, NULL, 'Replaced fuel filter and checked pump motor', '1x Fuel filter', 2, 'Waiting for replacement part', NOW(), NOW());

-- Display counts
SELECT 'Customers' as table_name, COUNT(*) as count FROM customers
UNION ALL
SELECT 'Assets', COUNT(*) FROM assets
UNION ALL
SELECT 'Visits', COUNT(*) FROM visits
UNION ALL
SELECT 'Service Requests', COUNT(*) FROM service_requests
UNION ALL
SELECT 'Feedback', COUNT(*) FROM feedback
UNION ALL
SELECT 'Maintenance Records', COUNT(*) FROM maintenance_records;










