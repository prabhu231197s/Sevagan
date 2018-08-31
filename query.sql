create table donors(
`id` int(255) not null primary key auto_increment,
`name` varchar(255) not null,
`sevaganId` varchar(255) not null unique,
`age` int(255) not null,
`gender` int(10) not null default 1,
`weight` float not null,
`email` varchar(500) not null unique,
`password` varchar(500) not null,
`phone` bigint(50) not null unique,
`bloodgroup` int(255) not null,
`latitude` double not null,
`longitude` double not null,
`period` int(255) not null,
`verified` int(1) not null default 0,
foreign key(gender) references gender(id),
foreign key(period) references periods(id),
foreign key(bloodgroup) references bloodgroups(id)
);

create table donortokenmap(
`id` int(255) not null primary key auto_increment,
`email` varchar(500) not null,
`token` varchar(500) not null,
foreign key(email) references donors(email)
);

create table gender(
`id` int(255) not null primary key auto_increment,
`name` varchar(500) not null unique
);


create table requests(
`id` int(255) not null primary key auto_increment,
`sevaganId` varchar(500) not null,
`bloodgroup` int(255) not null,
`patientname` varchar(500) not null,
`unitrequired` int(255) not null,
`unitacquired` int(255) not null default 0,
`casetype` int(10) not null default 1,
`location` varchar(255) not null,
`latitude` float not null,
`longitude` float not null,
foreign key(bloodgroup) references bloodgroups(id),
foreign key(casetype) references casetype(id)
);


create table casetype(
`id` int(255) not null primary key,
`name` varchar(500) not null
);

create table periods(
`id` int(255) not null primary key auto_increment,
`name` varchar(500) not null unique
);

create table bloodgroups(
`id` int(255) not null primary key auto_increment,
`group` varchar(500) not null unique
);


select * from gender;
select * from bloodgroups;

select * from periods;
select * from requests;
select * from donors;


create table foodrequest(
`id` int(255) not null primary key auto_increment,
`plates` int(255) not null,
`latitude` float not null,
`longitude` float not null,
`phone` bigint(10) not null,
`name` varchar(500) not null,
`status` int(255) not null
);
drop table donors;

select * from requests;

create table foods(
`id` int(255) not null primary key auto_increment,
`name` varchar(500) not null,
`parcel` int(255) not null,
`latitude` float not null,
`longitude` float not null,
`location` varchar(500) not null,
`phone` bigint(10) not null
);

select * from bloodbanks;

create table bloodbanks(
`id` int(255) not null primary key auto_increment,
`name`
);


select * from foods;
drop table foodrequest;

select * from foods;

select * from donors;
select * from casetype;

set foreign_key_checks = 0;