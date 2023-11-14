DROP TABLE review;
DROP TABLE payment;
DROP TABLE appointment;
DROP TABLE specialist_timeslot_location;
DROP TABLE specialist_timeslot_customer;
DROP TABLE administrator;
DROP TABLE user_payment_method;
DROP TABLE branch;
DROP TABLE customer;
DROP TABLE specialist;
DROP TABLE service;
DROP TABLE business;

CREATE TABLE specialist(
    specialistID INT PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    rating DECIMAL(2,1),
    specialistName VARCHAR(100) NOT NULL
);

CREATE TABLE service(
    serviceName VARCHAR(100) PRIMARY KEY
);

CREATE TABLE business(
    businessID INT PRIMARY KEY,
    businessName VARCHAR(100) NOT NULL
);

CREATE TABLE customer(
    userID INT,
    customerName VARCHAR(100) NOT NULL,
    phoneNo VARCHAR(100),
    email VARCHAR(320) UNIQUE NOT NULL,
    userPassword VARCHAR(320) NOT NULL,
    PRIMARY KEY(userID)
);

CREATE TABLE user_payment_method(
    userID INT,
    paymentDate DATE,
    method VARCHAR(50),
    PRIMARY KEY (userID, paymentDate),
    FOREIGN KEY (userID) REFERENCES customer(userID)
        ON DELETE SET NULL
);

CREATE TABLE branch(
    branchID INT,
    businessID INT,
    branchName VARCHAR(100) NOT NULL,
    branchAddress VARCHAR(100),
    phoneNo VARCHAR(100) NOT NULL,
    email VARCHAR(320),
    PRIMARY KEY (branchID, businessID),
    FOREIGN KEY (businessID) REFERENCES business(businessID)
        ON DELETE CASCADE
);

CREATE TABLE administrator(
    userID INT,
    adminName VARCHAR(100) NOT NULL,
    phoneNo VARCHAR(100) NOT NULL,
    email VARCHAR(320) UNIQUE NOT NULL,
    branchID INT NOT NULL,
    businessID INT NOT NULL,
    adminPassword VARCHAR(320) NOT NULL,
    PRIMARY KEY (userID),
    UNIQUE (branchID, businessID),
    FOREIGN KEY (branchID, businessID) REFERENCES branch(branchID, businessID)
            ON DELETE CASCADE
);

CREATE TABLE specialist_timeslot_customer(
    specialistID INT,
    startDate DATE,
    userID INT NOT NULL,
    PRIMARY KEY (specialistID, startDate),
    FOREIGN KEY (specialistID) REFERENCES specialist(specialistID)
        ON DELETE CASCADE,
    FOREIGN KEY (userID) REFERENCES customer(userID)
        ON DELETE CASCADE
);

CREATE TABLE specialist_timeslot_location(
    specialistID INT,
    startDate DATE,
    branchID INT NOT NULL,
    businessID INT NOT NULL,
    PRIMARY KEY (specialistID, startDate),
    FOREIGN KEY (specialistID) REFERENCES specialist(specialistID)
        ON DELETE CASCADE,
    FOREIGN KEY (branchID, businessID) REFERENCES branch(branchID, businessID)
        ON DELETE CASCADE
);

CREATE TABLE appointment(
    appID INT PRIMARY KEY,
    startDate DATE NOT NULL,
    specialistID INT,
    endDate DATE NOT NULL,
    serviceName VARCHAR(100) NOT NULL,
    UNIQUE(specialistID, startDate),
    FOREIGN KEY (specialistID) REFERENCES specialist(specialistID)
        ON DELETE CASCADE,
    FOREIGN KEY (specialistID, startDate) REFERENCES 
        specialist_timeslot_location(specialistID, startDate)
            ON DELETE SET NULL,
    FOREIGN KEY (serviceName) REFERENCES service(serviceName)
        ON DELETE SET NULL
);

CREATE TABLE payment(
    paymentID INT PRIMARY KEY,
    isPaid NUMBER(1) NOT NULL,
    price DECIMAL(10, 2),
    paymentDate DATE,
    userID INT NOT NULL,
    appID INT NOT NULL UNIQUE,
    FOREIGN KEY (userID, paymentDate)
    REFERENCES user_payment_method(userID, paymentDate)
        ON DELETE SET NULL,
    FOREIGN KEY (userID) REFERENCES customer(userID)
        ON DELETE SET NULL,
    FOREIGN KEY (appID) REFERENCES appointment(appID)
        ON DELETE SET NULL
);

CREATE TABLE review(
    reviewID INT PRIMARY KEY,
    reviewMessage VARCHAR(320),
    rating FLOAT NOT NULL,
    userID INT NOT NULL,
    appID INT UNIQUE NOT NULL,
    FOREIGN KEY (userID) REFERENCES customer(userID)
        ON DELETE CASCADE,
    FOREIGN KEY (appID) REFERENCES appointment(appID)
        ON DELETE CASCADE
);

-- ********** INSERT STATEMENTS **********

INSERT ALL
    INTO specialist (specialistID, email, rating, specialistName) VALUES (100, 'zariabruce@yahoo.com', 5.0, 'Zaria Bruce')
    INTO specialist (specialistID, email, rating, specialistName) VALUES (101, 'ashlyn_fry@gmail.com', 3.5, 'Ashlyn Fry')
    INTO specialist (specialistID, email, rating, specialistName) VALUES (102, 'kaydensanchez@hotmail.com', 4.6, 'Kayden Sanchez')
    INTO specialist (specialistID, email, rating, specialistName) VALUES (103, 'cobyliu@outlook.com', 2.7, 'Coby Liu')
    INTO specialist (specialistID, email, rating, specialistName) VALUES (104, 'david_wang1@business.com', 1.5, 'David Wang')
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO service (serviceName) VALUES ('Manicure')
    INTO service (serviceName) VALUES ('Tattoo')
    INTO service (serviceName) VALUES ('Physiotherapy')
    INTO service (serviceName) VALUES ('Haircut')
    INTO service (serviceName) VALUES ('Make-up')
SELECT 1 FROM DUAL COMMIT;
    
INSERT ALL
    INTO business (businessID, businessName) VALUES (1234, 'ACME Salon')
    INTO business (businessID, businessName) VALUES (5678, 'Inkwell Tattoo Shop')
    INTO business (businessID, businessName) VALUES (1057, 'The Barber Shop')
    INTO business (businessID, businessName) VALUES (9384, 'Smile Thai Wellness')
    INTO business (businessID, businessName) VALUES (8888, 'Sephora Mac Salon')
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO customer (userID, customerName, phoneNo, email, userPassword) VALUES (1, 'phillip chariot', '123-435-1239', 'philipchariot@gmail.com', '1234567890')
    INTO customer (userID, customerName, phoneNo, email, userPassword) VALUES (2, 'jared chinatown', '132-421-8123', 'jc@gmail.com', '1234567890')
    INTO customer (userID, customerName, phoneNo, email, userPassword) VALUES (3, 'alejandro mexico', '213-489-1293', 'am@gmail.com', '1234567890')
    INTO customer (userID, customerName, phoneNo, email, userPassword) VALUES (4, 'lipa dua', '213-423-4823', 'dualipa@gmail.com', '1234567890')
    INTO customer (userID, customerName, phoneNo, email, userPassword) VALUES (5, 'chess crackers', '123-483-9123', 'cc@gmail.com', '1234567890')
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO branch (branchID, businessID, branchName, branchAddress, phoneNo, email) VALUES  (1, 1234, 'East Vancouver ACME Salon', '215 Tolmie St', '123-456-7899', 'Eastvanacme@gmail.com') 
    INTO branch (branchID, businessID, branchName, branchAddress, phoneNo, email) VALUES  (2, 1234, 'Inkwell oakville', '210 North Service Rd W', '101-112-1314', 'oakville@inkwell.com')
    INTO branch (branchID, businessID, branchName, branchAddress, phoneNo, email) VALUES  (1, 1057, 'The Barber Shop LLoydmaster', '5612 44 St', '123-543-5673', 'thebarbershop@gmail.com' ) 
    INTO branch (branchID, businessID, branchName, branchAddress, phoneNo, email) VALUES  (1, 5678, 'Smile Thai Kelowna', '1567 Pandosy St', '341-435-1235', 'Smilethaikelowna@yahoo.com') 
    INTO branch (branchID, businessID, branchName, branchAddress, phoneNo, email) VALUES  (1, 8888, 'Sephora Bromont', '229 de Bromont Boul', '214-543-5673', 'sephora@bromont.com')
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO administrator (userID, adminName, phoneNo, email, branchID, businessID, adminPassword) VALUES (1, 'james Doe', '111-111-1118', 'jamesdoe@hotmail.com', 1, 1234, '1234567890')
<<<<<<< HEAD
    INTO administrator (userID, adminName, phoneNo, email, branchID, businessID, adminPassword) VALUES (2, 'james cameron', '111-111-5222', 'jamescameron@outlook.com,', 1, 5678, '1234567890')
=======
    INTO administrator (userID, adminName, phoneNo, email, branchID, businessID, adminPassword) VALUES (2, 'james cameron', '111-111-5222', 'jamescameron@outlook.com', 1, 5678, '1234567890')
>>>>>>> main
    INTO administrator (userID, adminName, phoneNo, email, branchID, businessID, adminPassword) VALUES (3, 'james cordon', '111-222-3353', 'james_cordon@gmail.com', 1, 1057, '1234567890')
    INTO administrator (userID, adminName, phoneNo, email, branchID, businessID, adminPassword) VALUES (4, 'james pepperoni', '222-333-6444', 'jamespepps@yahoo.com', 2, 1234, '1234567890')
    INTO administrator (userID, adminName, phoneNo, email, branchID, businessID, adminPassword) VALUES (5, 'reginold leopold the fifth', '555-666-2777', 'regleothe5@regleo.com', 1, 8888, '1234567890')
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO specialist_timeslot_location (startDate, specialistID, branchID, businessID) VALUES ((TO_DATE('17-12-2023 13:30', 'DD-MM-YYYY HH24:MI')), 100, 1, 8888)
    INTO specialist_timeslot_location (startDate, specialistID, branchID, businessID) VALUES ((TO_DATE('29-09-2023 09:00', 'DD-MM-YYYY HH24:MI')), 101, 1, 1057)
    INTO specialist_timeslot_location (startDate, specialistID, branchID, businessID) VALUES ((TO_DATE('01-08-2023 11:30', 'DD-MM-YYYY HH24:MI')), 102, 1, 1234)
    INTO specialist_timeslot_location (startDate, specialistID, branchID, businessID) VALUES ((TO_DATE('01-08-2023 10:30', 'DD-MM-YYYY HH24:MI')), 103, 2, 1234)
    INTO specialist_timeslot_location (startDate, specialistID, branchID, businessID) VALUES ((TO_DATE('09-07-2023 11:30', 'DD-MM-YYYY HH24:MI')), 103, 1, 5678)
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO specialist_timeslot_customer (startDate, specialistID, userID) VALUES ((TO_DATE('17-12-2023 13:30', 'DD-MM-YYYY HH24:MI')), 100, 1)
    INTO specialist_timeslot_customer (startDate, specialistID, userID) VALUES ((TO_DATE('29-09-2023 09:00', 'DD-MM-YYYY HH24:MI')), 101, 2)
    INTO specialist_timeslot_customer (startDate, specialistID, userID) VALUES ((TO_DATE('01-08-2023 11:30', 'DD-MM-YYYY HH24:MI')), 102, 1)
    INTO specialist_timeslot_customer (startDate, specialistID, userID) VALUES ((TO_DATE('01-08-2023 10:30', 'DD-MM-YYYY HH24:MI')), 103, 4)
    INTO specialist_timeslot_customer (startDate, specialistID, userID) VALUES ((TO_DATE('09-07-2023 11:30', 'DD-MM-YYYY HH24:MI')), 104, 5)
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO user_payment_method (userID, paymentDate, method) VALUES (1, (TO_DATE('17-12-2023 14:38', 'DD-MM-YYYY HH24:MI')), 'Cash')
    INTO user_payment_method (userID, paymentDate, method) VALUES (2, (TO_DATE('29-09-2023 10:02', 'DD-MM-YYYY HH24:MI')), 'Debit')
    INTO user_payment_method (userID, paymentDate, method) VALUES (1, (TO_DATE('01-08-2023 12:32', 'DD-MM-YYYY HH24:MI')), 'Credit')
    INTO user_payment_method (userID, paymentDate, method) VALUES (4, (TO_DATE('03/08/2023 10:30', 'DD-MM-YYYY HH24:MI')), 'E-Transfer')
    INTO user_payment_method (userID, paymentDate, method) VALUES (5, (TO_DATE('11/07/2023 14:11', 'DD-MM-YYYY HH24:MI')), 'Credit')
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO appointment (appID, startDate, specialistID, endDate, serviceName) VALUES (1, (TO_DATE('17-12-2023 13:30', 'DD-MM-YYYY HH24:MI')), 100, (TO_DATE('17-12-2023 15:30', 'DD-MM-YYYY HH24:MI')), 'Make-up')
    INTO appointment (appID, startDate, specialistID, endDate, serviceName) VALUES (2, (TO_DATE('29-09-2023 09:00', 'DD-MM-YYYY HH24:MI')), 101, (TO_DATE('29-09-2023 10:00', 'DD-MM-YYYY HH24:MI')), 'Haircut')
    INTO appointment (appID, startDate, specialistID, endDate, serviceName) VALUES (3, (TO_DATE('01-08-2023 11:30', 'DD-MM-YYYY HH24:MI')), 102, (TO_DATE('01-08-2023 13:00', 'DD-MM-YYYY HH24:MI')), 'Manicure')
    INTO appointment (appID, startDate, specialistID, endDate, serviceName) VALUES (4, (TO_DATE('01-08-2023 10:30', 'DD-MM-YYYY HH24:MI')), 103, (TO_DATE('01-08-2023 11:15', 'DD-MM-YYYY HH24:MI')), 'Tattoo')
    INTO appointment (appID, startDate, specialistID, endDate, serviceName) VALUES (5, (TO_DATE('09-07-2023 11:30', 'DD-MM-YYYY HH24:MI')), 103, (TO_DATE('09-07-2023 12:30', 'DD-MM-YYYY HH24:MI')), 'Tattoo')
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO review (reviewID, reviewMessage, rating, appID, userID) VALUES (1, 'Awesome experience', 5, 1, 1)
    INTO review (reviewID, reviewMessage, rating, appID, userID) VALUES (2, 'Not awesome experience', 3, 2, 2)
    INTO review (reviewID, reviewMessage, rating, appID, userID) VALUES (3, 'Liked this salon', 4, 3, 1)
    INTO review (reviewID, reviewMessage, rating, appID, userID) VALUES (4, 'Will not come back', 2, 4, 4)
    INTO review (reviewID, reviewMessage, rating, appID, userID) VALUES (5, 'Not satisfied', 2, 5, 5)
SELECT 1 FROM DUAL COMMIT;

INSERT ALL
    INTO payment (paymentID, isPaid, price, paymentDate, userID, appID) VALUES (1, 1, 70.25, (TO_DATE('17-12-2023 14:38', 'DD-MM-YYYY HH24:MI')),  1, 1)
    INTO payment (paymentID, isPaid, price, paymentDate, userID, appID) VALUES (2, 1, 30.00, (TO_DATE('29-09-2023 10:02', 'DD-MM-YYYY HH24:MI')),  2, 2)
    INTO payment (paymentID, isPaid, price, paymentDate, userID, appID) VALUES (3, 1, 180.50, (TO_DATE('01-08-2023 12:32', 'DD-MM-YYYY HH24:MI')), 1, 3)
    INTO payment (paymentID, isPaid, price, paymentDate, userID, appID) VALUES (4, 0, 200.09, (TO_DATE('03/08/2023 10:30', 'DD-MM-YYYY HH24:MI')), 4, 4)
    INTO payment (paymentID, isPaid, price, paymentDate, userID, appID) VALUES (5, 1, 401.02, (TO_DATE('11/07/2023 14:11', 'DD-MM-YYYY HH24:MI')), 5, 5)
SELECT 1 FROM DUAL COMMIT;

COMMIT;
