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

create table request (
id int not null auto_increment,
user varchar(50) not null,
method varchar(10) not null,
url varchar(2000) not null,
primary key (id),
constraint request_user foreign key (user) references user(username) on delete cascade on update cascade
);

create table response (
id int not null auto_increment,
user varchar(50) not null,
status int not null,
status_text varchar(50) not null,
primary key (id),
constraint response_user foreign key (user) references user(username) on delete cascade on update cascade
);

create table header (
header_id int not null auto_increment,
request int,
response int,
content_type varchar(50),
cache_control varchar(50),
pragma varchar(50),
expires datetime,
age int,
last_modified datetime,
host varchar(50),
primary key (header_id),
constraint of_response foreign key (response) references response(id) on delete cascade on update cascade,
constraint of_request foreign key (request) references request(id) on delete cascade on update cascade
);

insert into user values ('administrator','1','admin@har.com','admin');
insert into user values ('prisonmike','1','prisonmike@har.com','user');

insert into response(user,status,status_text) values('prisonmike','302','Found');
insert into header(request,response,content_type,cache_control,pragma,expires,age,last_modified,host)
	values(null,0,'text','no-cache','no-cache','2020-12-07 12:56:11','16970','2019-09-30 15:50:52',null);

insert into response(user,status,status_text) values('prisonmike','200','OK');
insert into header(request,response,content_type,cache_control,pragma,expires,age,last_modified,host)
	values(null,1,'text','public',null,'2020-12-06 17:39:26','268','2020-09-21 19:50:52',null);

insert into request(user,method,url) values('prisonmike','GET','http://obe.sandals.com');
insert into header(request,response,content_type,cache_control,pragma,expires,age,last_modified,host)
	values(0,null,null,null,null,null,null,null,'www.sandals.com');

insert into request(user,method,url) values('prisonmike','POST','https://ct.pinterest.com');
insert into header(request,response,content_type,cache_control,pragma,expires,age,last_modified,host)
	values(1,null,null,null,null,null,null,null,null);
