drop database if exists userdata;
create database userdata
	character set utf8;
use userdata;

create table user (
username varchar(50) not null,
password varchar(50) not null,
email varchar(50) not null,
type enum('user','admin') not null,
primary key (username),
index (type)
);

create table entry (
id int not null auto_increment,
user varchar(50) not null,
uploadDateTime datetime not null,
startedDateTime datetime not null,
wait int,
serverIPAddress varchar(50),
isp varchar(50) not null,
city varchar(50) not null,
primary key (id),
constraint entry_user foreign key (user) references user(username) on delete cascade on update cascade,
index (user,isp)
);

create table request (
id int not null auto_increment,
entry int not null,
method varchar(10) not null,
url varchar(2000) not null,
primary key (id),
constraint of_entry1 foreign key (entry) references entry(id) on delete cascade on update cascade,
index (method)
);

create table response (
id int not null auto_increment,
entry int not null,
status int,
status_text varchar(50),
primary key (id),
constraint of_entry2 foreign key (entry) references entry(id) on delete cascade on update cascade,
index (status)
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
host varchar(100),
primary key (id),
constraint of_response foreign key (response) references response(id) on delete cascade on update cascade,
constraint of_request foreign key (request) references request(id) on delete cascade on update cascade,
index (content_type)
);

create table cache_control (
header int not null,
control varchar(50) not null,
primary key (header,control),
constraint of_header foreign key (header) references header(id) on delete cascade on update cascade,
index (control)
);

insert into user values ('admin',MD5('1'),'admin@harjar.com','admin');