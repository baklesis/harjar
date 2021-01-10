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
entry_id int not null auto_increment,
user varchar(50) not null,
startedDateTime datetime not null,
serverIPAddress varchar(15) not null,
primary key (entry_id),
constraint entry_user foreign key (user) references user(username) on delete cascade on update cascade
);

create table timing (
timing_id int not null auto_increment,
entry int not null,
wait int not null,
primary key (timing_id),
constraint of_entry foreign key (entry) references entry(entry_id) on delete cascade on update cascade
);

create table response (
response_id int not null auto_increment,
user varchar(50) not null,
method varchar(10) not null,
url varchar(2000) not null,
primary key (response_id),
constraint response_user foreign key (user) references user(username) on delete cascade on update cascade
);

create table request (
request_id int not null auto_increment,
user varchar(50) not null,
status int not null,
status_text varchar(50) not null,
primary key (request_id),
constraint request_user foreign key (user) references user(username) on delete cascade on update cascade
);

create table header (
header_id int not null auto_increment,
response int,
request int,
content_type varchar(50),
cache_control varchar(50),
pragma varchar(50),
expires datetime,
age int,
last_modified datetime,
host varchar(50),
primary key (header_id),
constraint of_response foreign key (response) references request(request_id) on delete cascade on update cascade,
constraint of_request foreign key (request) references request(request_id) on delete cascade on update cascade
);

insert into user values ('admin','1','admin@har.com','admin');
insert into user values ('prisonmike','1','prisonmike@har.com','user');
