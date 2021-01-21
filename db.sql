drop database if exists userdata;
create database userdata;
use userdata;

create table user (
username varchar(50) not null,
password varchar(50) not null,
email varchar(50) not null,
type enum('user','admin') not null,
primary key (username)
);

create table entry (
id int not null auto_increment,
user varchar(50) not null,
uploadDateTime datetime not null,
startedDateTime datetime not null,
wait float,
serverIPAddress varchar(50) not null,
isp varchar(50) not null,
city varchar(50) not null,
primary key (id),
constraint entry_user foreign key (user) references user(username) on delete cascade on update cascade
);

create table request (
id int not null auto_increment,
entry int not null,
method varchar(10) not null,
url varchar(2000) not null,
primary key (id),
constraint of_entry1 foreign key (entry) references entry(id) on delete cascade on update cascade,
);

create table response (
id int not null auto_increment,
entry int not null,
status int not null,
status_text varchar(50) not null,
primary key (id),
constraint of_entry2 foreign key (entry) references entry(id) on delete cascade on update cascade,
);

create table header (
id int not null auto_increment,
request int,
response int,
content_type varchar(50),
pragma varchar(50),
expires datetime,
max_age int,
age int,
last_modified datetime,
host varchar(50),
primary key (id),
constraint of_response foreign key (response) references response(id) on delete cascade on update cascade,
constraint of_request foreign key (request) references request(id) on delete cascade on update cascade
);

create table cache_control (
header int not null,
control varchar(50) not null,
primary key (header,control),
constraint of_header foreign key (header) references header(id) on delete cascade on update cascade
);

insert into user values ('admin',MD5('1'),'admin@har.com','admin');
insert into user values ('prisonmike',MD5('1'),'prisonmike@har.com','user');


insert into entry(user,uploadDateTime,startedDateTime,serverIPAddress,wait,isp,city) values('prisonmike',now(),'2020-12-17 8:27:02','52.85.223.187',217.41,'Wind','Patras');

insert into response(entry,status,status_text) values(1,'302','Found');
insert into header(request,response,content_type,pragma,max_age,age,host)
	values(null,1,'text','no-cache','31536000','16970',null);
insert into cache_control(header,control) VALUES (1,'no-cache');
insert into cache_control(header,control) VALUES (1,'public');

insert into response(entry,status,status_text) values(1,'200','OK');
insert into header(request,response,content_type,pragma,max_age,age,host)
	values(null,2,'text',null,'1800','268',null);
insert into cache_control(header,control) VALUES (2,'no-cache');
insert into cache_control(header,control) VALUES (2,'private');

insert into request(entry,method,url) values(1,'GET','http://obe.sandals.com');
insert into header(request,response,content_type,pragma,expires,age,last_modified,host)
	values(1,null,null,null,null,null,null,'www.sandals.com');

insert into request(entry,method,url) values(1,'POST','https://ct.pinterest.com');
insert into header(request,response,content_type,pragma,expires,age,last_modified,host)
	values(2,null,null,null,null,null,null,null);


insert into entry(user,uploadDateTime,startedDateTime,serverIPAddress,wait,isp,city) values('prisonmike',now(),'2020-11-17 08:27:02','24.48.0.1',217.41,'Vodafone','Patras');


insert into response(entry,status,status_text) values(2,'302','Found');
insert into header(request,response,content_type,pragma,max_age,age,host)
	values(null,3,'text','no-cache','86400','16970',null);
insert into cache_control(header,control) VALUES (5,'no-store');
insert into cache_control(header,control) VALUES (5,'private');

insert into response(entry,status,status_text) values(2,'200','OK');
insert into header(request,response,content_type,pragma,expires,age,last_modified,host)
	values(null,4,'text',null,'2020-12-06 17:39:26','268','2020-09-21 19:50:52',null);
insert into cache_control(header,control) VALUES (6,'no-store');
insert into cache_control(header,control) VALUES (6,'public');

insert into request(entry,method,url) values(2,'GET','http://obe.sandals.com');
insert into header(request,response,content_type,pragma,age,host)
	values(3,null,null,null,null,'www.sandals.com');

insert into request(entry,method,url) values(2,'POST','https://ct.pinterest.com');
insert into header(request,response,content_type,pragma,expires,age,last_modified,host)
	values(4,null,null,null,null,null,null,null);
