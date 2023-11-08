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
    paymentID INT UNIQUE NOT NULL,
    reviewID INT UNIQUE,
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
    rating INT NOT NULL,
    userID INT NOT NULL,
    appID INT UNIQUE NOT NULL,
    FOREIGN KEY (userID) REFERENCES customer(userID)
        ON DELETE CASCADE,
    FOREIGN KEY (appID) REFERENCES appointment(appID)
        ON DELETE CASCADE
);

-- INSERT INTO Review (reviewID, message, rate, appID, userID)
-- VALUES
--     (1, “Awesome experience”, 5, 1, 1),
--     (2, “Not awesome experience”, 3, 2, 2),
--     (3, “Liked this salon”, 4, 3, 1),
--     (4, “Will not come back”, 2, 4, 4),
--     (5, “Not satisfied”, 2, 5, 5);

-- INSERT INTO SpecialistTimeslot_Location(date, specialistID, startTime, branchID, businessID)
-- VALUES
--     (‘17/12/2023’, 100, ‘13:30’, 1823, 8888),
--     (‘29/09/2023’, 101, ‘09:00’, 9101, 1057),
--     (‘01/08/2023’, 102, ‘11:30’, 1234, 1234),
--     (‘01/08/2023’, 103, ‘10:30’, 5678, 5678),
--     (‘09/07/2023’, 103, ‘11:30’, 5678, 5678);

-- INSERT INTO Appointment (appID, date, specialistID, startTime, endTime, serviceName,
-- paymentID, reviewID)
-- VALUES
--     (1, ‘17/12/2023’, 100, ‘13:30’, ‘15:30’, ‘Make-up’, 1, 1),
--     (1, ‘29/09/2023’, 101, ‘09:00’, ‘10:00’, ‘Haircut’, 2, 2),
--     (1, ‘01/08/2023’, 102, ‘11:30’, ‘13:00’, ‘Manicure’, 3, 3),
--     (1, ‘01/08/2023’, 103, ‘10:30’, ‘11:15’, ‘Tattoo’, 4, 4),
--     (1, ‘09/07/2023’, 103, ‘11:30’, ‘12:30’, ‘Tattoo’, 5, 5);

-- INSERT INTO SpecialistTimeslot_Customer(date, specialistID, startTime, userID)
-- VALUES
--     (‘17/12/2023’, 100, ‘13:30’, 1),
--     (‘29/09/2023’, 101, ‘09:00’, 2),
--     (‘01/08/2023’, 102, ‘11:30’, 1),
--     (‘01/08/2023’, 103, ‘10:30’, 4),
--     (‘09/07/2023’, 103, ‘11:30’, 5);

-- INSERT INTO UserPayment_Method(userID, date, time, method)
-- VALUES
--     (1, ‘17/12/2023’, ‘14:38’, “Cash”),
--     (2, ‘29/09/2023’, ‘10:02’, “Debit”),
--     (1, ‘01/08/2023’, ‘12:32’, “Credit”),
--     (4, ‘03/08/2023’, ‘10:30’, “E-Transfer”),
--     (5, ‘11/07/2023’, ‘14:11’, “Credit”);

-- INSERT INTO Payment(paymentID, isPaid, price, date, time, userID, appID)
-- VALUES
--     (1, 1, 70.25, ‘17/12/2023’, ‘13:30’, 1, 1),
--     (2, 1, 30.00, ‘29/09/2023’, ‘09:00’, 2, 2),
--     (3, 1, 180.50, ‘01/08/2023’, ‘11:30’, 1, 3),
--     (4, 0, 200.09, ‘03/08/2023’, ‘10:30’, 4, 4),
--     (5, 1, 401.02, ‘11/07/2023’, ‘11:30’, 5, 5);

-- INSERT
-- INTO Specialist (specialistID, email, rating, name)
-- VALUES
--     (100, ‘zariabruce@yahoo.com’, 5.0, ‘Zaria Bruce’),
--     (101, ‘ashlyn_fry@gmail.com’, 3.5, ‘Ashlyn Fry’),
--     (102, ‘kaydensanchez@hotmail.com’, 4.6, ‘Kayden Sanchez’),
--     (103, ‘cobyliu@outlook.com’, 2.7, ‘Coby Liu’),
--     (104, ‘david_wang1@business.com’, 1.5, ‘David Wang’)

-- INSERT
-- INTO Service (name)
-- VALUES
--     (‘Manicure’),
--     (‘Tattoo’),
--     (‘Physiotherapy’),
--     (‘Haircut’),
--     (‘Make-up’);

-- INSERT
-- INTO Business (businessID, name)
-- VALUES
--     (1234, ‘ACME Salon’),
--     (5678, ‘Inkwell Tattoo Shop’),
--     (1057, ‘The Barber Shop’),
--     (9384, ‘Smile Thai Wellness’),
--     (8888, ‘Sephora Mac Salon’);

-- INSERT
-- INTO Customer (userID, name, phoneNo, email)
-- VALUES
--     (1, phillip chariot, 123-435-1239, ‘philipchariot@gmail.com’)
--     (2, jared chinatown, 132-421-8123, ‘jc@gmail.com’)
--     (3, alejandro mexico, 213-489-1293, ‘am@gmail.com’)
--     (4, lipa dua, 213-423-4823, ‘dualipa@gmail.com’)
--     (5, chess crackers, 123-483-9123, ‘cc@gmail.com’);

-- INSERT
-- INTO Administrator (userID, name, phoneNo, email, branchID, businessID)
-- VALUES
--     (1, james Doe, 111-111-1118, ‘jamesdoe@hotmail.com’, 1234, 1234)
--     (2, james cameron, 111-111-5222, ‘jamescameron@outlook.com,’ 5678, 5678)
--     (3, james cordon, 111-222-3353, ‘james_cordon@gmail.com’, 9101, 1057)
--     (4, james pepperoni , 222-333-6444, ‘jamespepps@yahoo.com’, 1, 9384)
--     (5, reginold leopold the fifth, 555-666-2777, ‘regleothe5@regleo.com’, 1823, 8888);

-- INSERT
-- INTO Branch(branchID, businessID, name, address, phoneNo, email, adminID)
-- VALUES
--     (1234, 1234, ‘East Vancouver ACME Salon’, ‘215 Tolmie St’, 123-456-7899,
--     ‘Eastvanacme@gmail.com’, 1)
--     (5678, 5678, ‘Inkwell oakville’, ‘210 North Service Rd W’, 101-112-1314,
--     ‘oakville@inkwell.com’, 2)
--     (9101, 1057, ‘The Barber Shop LLoydmaster’, ‘5612 44 St’, 123-543-5673,
--     ‘thebarbershop@gmail.com’ , 3)
--     (1, 9384, ‘Smile Thai Kelowna’, ‘1567 Pandosy St’, 341-435-1235,
--     ‘Smilethaikelowna@yahoo.com’, 4)
--     (1823, 8888, ‘Sephora Bromont’ ‘229 de Bromont Boul’, 214-543-5673,
--     ‘sephora@bromont.com’, 5);
