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
entry_id not null auto_increment,
user varchar(50) not null,
startedDateTime datetime not null,
serverIPAddress varchar(15) not null,
primary key (entry_id),
constraint of_user foreign key (user) references user(username) on delete cascade on update cascade
);

create table timing (
timing_id not null auto_increment,
entry int not null,
wait int not null,
primary key (entry_id),
constraint of_entry foreign key (entry) references entry(entry_id) on delete cascade on update cascade
);

create table response (
response_id not null auto_increment,
user varchar(50) not null,
method varchar(10) not null,
url varchar(2000) not null,
primary key (response_id),
constraint of_user foreign key (user) references user(username) on delete cascade on update cascade
);

create table request (
request_id not null auto_increment,
user varchar(50) not null,
status int not null,
status_text varchar(50) not null,
primary key (request_id),
constraint of_user foreign key (user) references user(username) on delete cascade on update cascade
);

create table header (
header_id not null auto_increment,
response int,
request int,
--content_type
--cache_control
--pragma
--expires
--age
--last_modified
--host
primary key (header_id),
constraint of_response foreign key (response) references request(request_id) on delete cascade on update cascade,
constraint of_request foreign key (request) references request(request_id) on delete cascade on update cascade
);
