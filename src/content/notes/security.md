---
title: "Cyber Phisical Security ITA-(2022/2023)"
description: "Cyber-Phisical Security"
date: 2022-10-17
course: "Cyber Physical Security"
order: 4
draft: true
---

![](/ox-hugo/security.jpeg)

## *Intro e disclaimer*

```text
Questa pagina (in italiano) contiene i miei appunti del corso di
"Cyber Phisical security" del corso triennale di ingegneria informatica
di Unimore (sede di Mantova).
Verranno riassunte le parti più importanti/meno intuitive/semplici del materiale didattico,
insieme a commenti e considerazioni (a volte eventuali approfondimenti).
Il materiale qui fornito non è sostitutivo alle slide del corso.
```

→ Link per accedere al `materiale didattico`:

[https://moodle.unimore.it/course/view.php?id=8096](https://moodle.unimore.it/course/view.php?id=8096)

→ Link per `nebula`:

[https://exploit.education/nebula/](https://exploit.education/nebula/)

---

## (SC) TABLE OF CONTENTS

-   [Esecuzione Privilegi Elevati (Lezione 3)](#esecuzione-privilegi-elevati--lezione-3)
-   [Vulnerabilità Applicazioni - Local Injection (Lezione 4)](#vulnerabilit%C3%A0-applicazioni-local-injection--lezione-4)

---

## Esecuzione Privilegi Elevati (Lezione 3)

### Introduzione

A partire da UNIX system V esistono 3 tipologie di User / Group ID:

1.  u/g ID reale;
2.  u/g ID effettivo;
3.  u/g ID salvato;

Quando parte un processo, le credenziali “salvate” assumono il valore delle credenziali effettive. In questo modo possono tornare utili al momento del privilege drop, quando da credenziali “superiori” temporanee si deve tornare alle credenziali effettive.

### Hands On

Come recuperare gli ID reali ed effettivi? –> con le seguenti chiamate di sistema: = –> ritorna l’ID **reale** del processo invocante;

-   `geteuid` –> ritorna l’ID **effettivo** del processo invocante;

Una pratica utile è l’**abbassamento dei privilegi** (anche detto privilege-drop), utile per evitare l’esecuzione di applicazioni interamente con privilegi di root.

-   modalità **permanente** –> `setuid(getuid())`;
-   modalità **temporanea** –> `seteuid(getuid())`;

Nell’esempio seguente vengono usati i concetti appena descritti.

```c
#include <unistd.h>
#include <sys/types.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]){

      uid_t uid, euid;
      uid_t priv_uid;

      uid = getuid(); // id reale del processo
      euid = geteuid(); // id effettivo del processo
      priv_uid = euid; // id saved

      // stampo id reale ed effettivo PRIMA del privilege drop (temporaneo)
      printf("Prima di seteuid(uid): UID reale del processo = %d\n", uid);
      printf("Prima di seteuid(uid): UID effettivo del processo = %d\n", euid);

      if(seteuid(uid) == -1){
	      printf("Non sono riuscito ad abbassare i privilegi.\n");
	      exit(1);
      }

      // stampo id reale ed effettivo DOPO il privilege drop (temporaneo)
      uid = getuid();
      euid = geteuid();

      printf("Dopo seteuid(uid): UID reale del processo = %d\n", uid);
      printf("Dopo seteuid(uid): UID effettivo del processo = %d\n", euid);

      if(seteuid(priv_uid) == -1){
	      printf("Non sono riuscito a ripristinare i privilegi.\n");
	      exit(1);
      }

      uid = getuid();
      euid = geteuid();

      // stampo id reale ed effettivo dopo il privilege restore
      printf("Dopo seteuid(priv_uid): UID reale del processo = %d\n", uid);
      printf("Dopo seteuid(priv_uid): UID effettivo del processo = %d\n", euid);
}
```

Altre due chiamate di sistema per lavorare con gli UID:

-   `getresuid` –> recupera tutti gli UID (saved compreso) del processo invocante;
-   `setresuid` –> per impostare tutti gli UID del processo;

Privilege drop **permanente**:

```bash
setresuid(uid, uid, uid);
```

In questo modo vengono abbassati permanentemente i privilegi del processo invocante. Essenzialmente “blocco” tutti gli UID a quelli specificati.

Privilege drop **temporaneo**:

```bash
setresuid(-1, getuid(), -1);
setresuid(-1, uid, -1) ≡ seteuid(uid);
```

Ripristino temporaneo dei privilegi:

```bash
setresuid(-1, privileged_ID, -1);
```

In generale non viene mai acceso il SETUID su una shell, altrimenti le conseguenze potrebbero essere gravi. Ricorda che quando un file (con SETUID acceso) viene copiato, il SETUID/SETGID viene automaticamente rimosso.

Una considerazione è da fare su il **tracciamento** dei processi: si potrebbero sfruttare “tracciatori” come *strace* o *gdb* per analizzare le chiamate di sistema di un processo con alti privilegi, per poi provare a fare una privilege escalation. Per evitare questo problema, si possono inibire i SETUID/ SETGID, in modo da impedire l’aggancio del programma tracciante al programma tracciato.

Un metodo ancora più sicuro di strutturare i privilegi è quello delle **capabilities** –> `man 7 capabilities`.

### Esercizio Nebula (level00)

Per cambiare il layout della tastiera, loggare come nebula (password nebula), usare il comando **loadkeys it** poi loggare come flag00.

Per verificare l’id di un utente, usare il comando **id <nomeutente>**

```bash
find / -perm -4000 -exec ls -l {} \; 2>/dev/null | grep level00
/bin/.../flag00
getflag

pidof /bin/.../flag00 # in questo modo ottieni il pid del processo
ps -p $(pidof /bin/.../flag00) -o ruid,rgid,euid,egid
```

### Materiale utile

Per una visione più completa sulle chiamate di sistema, consultare il materiale al seguente link:

```text
https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiAjbn0n736AhWQYPEDHUYGBXMQFnoECAUQAQ&url=https%3A%2F%2Fweblab.ing.unimore.it%2Fpeople%2Fandreoli%2Fdidattica%2Fsistemi-operativi%2F2014-15%2F7-chiamate-sistema%2F7-chiamate-sistema.pdf&usg=AOvVaw1UkLh5mnZwXHESHHGBfB1e
```

---

## Vulnerabilità Applicazioni - Local Injection (Lezione 4)

### Introduzione e alcune definizioni

-   **Zero day attack:** attacco che sfrutta una vulnerabilità scoperta a pochi giorni dal rilascio del software.

![Timeline di una vulnerabilità software](/ox-hugo/zeroday.png "Timeline di una vulnerabilità software")

Tendenzialmente la maggior parte delle vulnerabilità sono dovute alla mancanza / incompletezza della **validazione dell’input**. Studieremo in seguito le vulnerabilità più frequenti.

**Mediazione incompleta**: quando dati sensibili (sulla base dei quali vengono fatte operazioni critiche) sono esposti o non protetti correttamente. Nelle applicazioni tradizionali, questo tipo di vulnerabilità si presenta spesso nel momento in cui un’utente ha il permesso di modificare file intermendi (per esempio memorizzati in /tmp).

**TOC/TOU** (*Time Of Check to Time Of Use*): esempio web-app:

1.  Un utente vuole modificare una pagina wikipedia;
2.  L’autorizzazione viene concessa;
3.  Un amministratore blocca la pagina senza revocare le autorizzazioni, prima che la pagina venga modificata;
4.  L’utente modifica la pagina dopo il blocco;

Spesso per risolvere questo tipo di problemi bisogna riprogettare logicamente l’applicazione. Questa risulta essere una pratica costosa/molto impegnativa nella maggior parte dei casi.

**Code injection:**, vulnerabilità quasi sempre dovuta ad una mancata validazione dell’input.

### Local Injection (1/2), Lv.1 Nebula

Analizzando il codice fornito sul sito, ci si accorge che esegue un operazione sospetta (esegue system()) dopo aver aumentato i suoi privilegi.

```c
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <stdio.h>

int main(int argc, char **argv, char **envp)
{
  gid_t gid;
  uid_t uid;
  gid = getegid();
  uid = geteuid();

  setresgid(gid, gid, gid);
  setresuid(uid, uid, uid);

  system("/usr/bin/env echo and now what?");
}
```

-   Il comando /usr/bin/env permette di eseguire comandi usando variabili d’ambiente modificate. In questo caso esegue il comando /usr/bin/echo (esterno, preferito rispetto al builtin.)
-   L’idea è quella di modificare la variabile d’ambiente PATH in modo da fornire un path personalizzato (al posto di /bin, /usr/bin, ecc) per far eseguire un comando “echo” modificato o malevolo.
-   Basta quindi copiare /bin/getflag in /tmp/echo, per poi modifcare la variabile d’ambiente PATH in questo modo: **PATH=/tmp**;

Ecco alcune possibili **mitigazioni** di questa vulnerabilità:

1.  Togliere il setuid usando `chmod u-s /home/flag01/flag01`
2.  Eseguire un privilege drop con `setresuid(-1, uid, -1);`
3.  Usare la funzione di libreria `putenv()` (man 3 putenv) per settare un Path sicuro prima dell’esecuzione del comando critico. `putenv("PATH=/bin:/sbin:/usr/bin:/usr/sbin")`

### Local Injection (2/2), Lv.2 Nebula

```c
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <stdio.h>

int main(int argc, char **argv, char **envp)
{
  char *buffer;

  gid_t gid;
  uid_t uid;

  gid = getegid();
  uid = geteuid();

  setresgid(gid, gid, gid);
  setresuid(uid, uid, uid);

  buffer = NULL;

  asprintf(&buffer, "/bin/echo %s is cool", getenv("USER"));
  printf("about to call system(\"%s\")\n", buffer);

  system(buffer);
}
```

La vulnerabilità di questo codice sta come al solito nella funzione *system()*, che esegue un comando che dipende dal contenuto della varabile “buffer”. Esso dipende a sua volta dalla variabile d’ambiente USER, che può essere facilmente modificata nel modo seguente:

```bash
USER='hacked;/tmp/getflag;'
```

Basta poi copiare /bin/getflag in /tmp/getflag per ottenere l’esecuzione del programma con privilegi elevati. Questo problema può essere risolto analogamente al precedente.

## Vulnerabilità Applicazioni - Remote Injection (Lezione 5)
