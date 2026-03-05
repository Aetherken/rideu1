CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  student_id VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin', 'driver', 'superadmin') DEFAULT 'student',
  status ENUM('active', 'deactivated', 'banned') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  origin VARCHAR(255) DEFAULT 'Vimal Jyothi Engineering College',
  destination_city_id INT NOT NULL,
  duration_minutes INT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (destination_city_id) REFERENCES cities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  number VARCHAR(50) UNIQUE NOT NULL,
  city_id INT NOT NULL,
  capacity INT NOT NULL,
  status ENUM('active', 'maintenance', 'retired') DEFAULT 'active',
  image_url VARCHAR(500),
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS time_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  seats_available INT NOT NULL,
  status ENUM('active', 'cancelled') DEFAULT 'active',
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  route_id INT NOT NULL,
  bus_id INT NOT NULL,
  time_slot_id INT NOT NULL,
  fare DECIMAL(10,2) NOT NULL,
  status ENUM('active', 'used', 'expired', 'cancelled') DEFAULT 'active',
  pass_id VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('announcement', 'delay', 'maintenance', 'personal') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  route_id INT, -- Nullable for system-wide announcements
  scheduled_at TIMESTAMP NULL,
  sent_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (sent_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fare_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  updated_by INT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flagged_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reason TEXT NOT NULL,
  flagged_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (flagged_by) REFERENCES users(id) ON DELETE CASCADE
);
