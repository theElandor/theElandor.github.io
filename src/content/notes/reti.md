---
title: "Protocolli e architetture di rete ITA-(2022/2023)"
description: "protocolli e architetture di rete"
date: 2022-12-29
course: "Protocolli e architetture di rete"
year: "2022/2023"
order: 1
---

![](/ox-hugo/internet.jpeg)

## *Cosa posso trovare qui?*

Questa pagina (in italiano) contiene i miei appunti del corso di “Protocolli e architetture di rete” del corso triennale di informatica di Unimore. Verranno quindi riportati gli approfondimenti/chiarimenti che vengono fatti durante le lezioni. Il materiale include i write-up delle esperienze fatte in laboratorio.

→ Link per accedere al `materiale didattico`:

2022/2023 –> [https://weblab.ing.unimore.it/protocolli/2223](https://weblab.ing.unimore.it/protocolli/2223)

2021/2022 –> [https://weblab.ing.unimore.it/protocolli/2122/](https://weblab.ing.unimore.it/protocolli/2122/)

Le credenziali per accedere al materiale di quest’anno sono:

-   **username**: PAR2223
-   **password**: Kaw8Meir

Le credenziali per accedere al materiale dell’anno scorso sono:

-   **username**: PAR2122
-   **password**: Enae3pie

## *Troubleshooting*

Se la pagina non carica correttamente i contenuti in latec, basta `ricaricare` la pagina una o al massimo un paio di volte. Questo problema può essere legato alla grande quantità di testo e immagini presenti in questa sezione.

---

## TABLE OF CONTENTS

-   [METODI DI COMUNICAZIONE](#metodi-di-comunicazione)
-   [PROTOCOLLO TCP/IP](#protocollo-tcp-ip)
-   [(HTN) INTRODUZIONE](#htn--introduzione)
-   [(HTN) LAN e ETHERNET](#htn--lan-e-ethernet)
-   [(HTN) INTERCONNESSIONI DI RETE E ACCESSO A INTERNET](#htn--interconnessioni-di-rete-e-accesso-a-internet)
-   [VLAN](#vlan)
-   [(IP) Livello IP](#ip--livello-ip)
-   [(IP) Subnetting](#ip--subnetting)
-   [(IP) Ip routing](#ip--ip-routing)
-   [BGP](#bgp)
-   [(TCP)](#tcp)
-   [DNS](#dns)
-   [DHCP](#dhcp)
-   [Security](#security)
-   [Email](#email)
-   [Lab 6-10](#lab-6-10)
-   [Lab 20-10](#lab-20-10)
-   [Lab 27-10](#lab-27-10)
-   [Lab 3-11](#lab-3-11)
-   [Lab/Lezione 17-11](#lab-lezione-17-11)
-   [Lab/Lezione 24-11](#lab-lezione-24-11)
-   [Esercizi](#esercizi)

---

## METODI DI COMUNICAZIONE

[–> TOC](#table-of-contents) ![](/ox-hugo/protocolli_intro_sintesi.png)

I protocolli hanno senso se condivisi, bisogna definire degli **standard** comuni.

-   `ISO/OSI` –> standard **de iure**, prima progettato su carta.

Sviluppato su 7 livelli come in Figura 1. Il pacchetto viene “inviato” dallo strato fisico di un host all’altro, poi viene “depacchettizzato”.

1.  **Livello fisico** : interessante dal punto di vista elettronico.
2.  **Livello di collegamento**: stabilisce come vengono strutturati i pacchetti appena prima che vengano trasmessi fisicamente.Il pacchetto a questo stadio viene anche chiamato **frame** (es. contiene dei bit per sincronizzare le schede di rete prima della configurazione effettiva).
3.  **Livello di rete** Livello centrale, si occupa dell’instradamento dei pacchetti.
4.  **Livello di trasporto**: trasporto dei pacchetti nella rete (nodi).
5.  **Livello di sessione**: vuole ricreare un’astrazione di alto livello, ri-orgranizzando i pacchetti.
6.  **Livello di presentazione**: si occupa di come viene *rappresentata* l’informazione.
7.  **Livello di applicazione**: fornisce un’interfaccia per le applicazioni che si interfacciano con la rete.

![ISO/OSI stack](/ox-hugo/osi_layers.png "ISO/OSI stack")

-   **`TCP/IP`** –> ha prevalso nello sviluppo di internet.

Diversi layer comportano un costo –> si cerca di snellire lo stack, diminuendo il numero di livelli. Nonostante ciò, si vuole mantanere la numerazione precedente (Livello trasporto –> 4, Livello Rete –> 3).

![tcp/ip stack](/ox-hugo/tcpip.png "tcp/ip stack")

---

## PROTOCOLLO TCP/IP

[–> TOC](#table-of-contents)

![](/ox-hugo/htn.png)

2- **Host to Network** Modifiche del protocollo HTN non dovrebbero impattare il resto della rete: (es. posso creare una rete universitaria, basta avere l’hardware necessario).

3- **Network**: Protocollo per la consegna dei pacchetti da un host mittente ad un destinatario. Ci si occupa semplicemente dell’invio dei pacchetti, non ci si preoccupa di sessioni, pacchetti mancanti, congestione, o simili.

4- **Transport**: servizio di consegna con impegno tra due *processi applicativi* che stanno eseguendo su due host terminali. (es TCP, UDP);

5- **Application**: lo vedremo in seguito.

i layer 3 e 4 sono sempre essenzialmente quelli, possono cambiare spesso i livelli 2 e 5 nelle telecomunicazioni!

![Modello a clessidra](/ox-hugo/clessidra.png "Modello a clessidra")

(es. Alcune applicazioni potrebbero avere la necessità di sfruttare il protocollo TCP perchè **vuole garantire la consegna di tutti i pacchetti** ).

(es. A livello host to network, una rete wireless potrebbe preoccuparsi della garanzia di consegna dei pacchetti. In questo modo risolvo **localmente** un possibile problema di non consegna dei pacchetti. Se non me ne preoccupo localmente, un’altro host dall’altra parte del mondo potrebbe ricevere dei dati non completi.)

(solitamente ci si occupa dell’affidabilità a livello **end to end**, a me interessa che le applicazioni comunichino correttamente!)

–> **morale**: posso decidere di risolvere i problemi in diversi layer dello stack, quindi a seconda del contesto si possono spostare alcune funzioni in altri livelli dello stack.

Non tutti i dispositivi(nodi) implementano tutto lo stack, si possono basare soltanto su alcuni layer. Switch e bridge sono dispositivi di livelo 2, che basano il loro funzionamento **soltanto** sul livello 2 (non sanno nulla del protocolli IP ad esempio)! Il concetto è estendibile: un **router** legge fino al livello 3, quindi fino all’indirizzo IP!

![Dispositivi Livello 2](/ox-hugo/switch.png "Dispositivi Livello 2")

Tuttavia esistono delle eccezioni, come gli switch di livello 3, quindi anche qua c’è flessibilità.

**Deep packet inspection:** –> quando si parla di dispositivi che sono in grado di analizzare più in profondità i pacchetti: riesce a leggere informazioni anche a livelli più alti dello stack.

---

## (HTN) INTRODUZIONE

[–> TOC](#table-of-contents)

Gli scopi del livello Host to Network sono:

-   **`interconnessione`** tra due o più host;
-   **`trasmisionne di dati`** tra host interconnessi;
-   **`connessione`** di un host a internet;

Nello stack TCP/IP questi 3 aspetti sono fortemente interconnessi tra di loro.

Alcuni esempi:

-   **LAN** wired: Ethernet;
-   **LAN** wireless: 802.11x;
-   **PAN**: (Bluetooth);
-   Mediante **modem**;
-   **WAN** wireless;

L’unità informativa è chiamata `frame` (host- router/switch, router/switch-router/switch, host-host).

Come anticipato, il livello H2N comprende 2 sottolivelli:

1.  Livello “**fisico**": ci si riferisce alla vera e propria connessione “fisica” tra gli host (cavo coassiale, fibra ottica, trasmissione radio, modem);
2.  Livello “**data link**": che si occupa dell’incapsulamento e invio dei dati tra gli host.

### Modalità di trasmissione

1.  **`Unicast`** –> un mittente e un destinatario;
2.  **Multicast** –> comunicazione tra un mittente e un gruppo di destinatari;
3.  **Anycast** –> mittente che vuole comunicare con **un** mittente in un gruppo;
4.  **`Broadcast`** –> mittente che vuole comunicare un’informazione a tutti;

### Tipi fisici di collegamento

1.  `Mezzo broadcast` Un mezzo broadcast è un mezzo attraverso il quale un host invia informazioni a tutti gli host collegati. Si può sfruttare un dispositivo broadcast per riservare delle informazioni (ad es.) ad alcune interfacce di rete.
    
2.  `Mezzo punto a punto` collegamento pensato per fornire comuncazione tra 2 punti soltanto.
    
    -   **Half-Duplex**: collegamento che permette ad un solo host di inviare dati sul mezzo fisico in un determinato instante.
    -   **Full-Duplex**: collegamento bidirezionale, collegamenti interni dedicati per entrambe le direzioni (nel caso di un punto a punto).

E' importante capire bene la differenza tra **modalità di trasmissione** e **tipi fisici di collegamento**. Infatti, a prescindere dal mezzo, un protocollo può prevedere molteplici modalità di trasmissione.

## (HTN) LAN e ETHERNET

[–> TOC](#table-of-contents)

### Introduzione

Rete che consente la comunicazione tra dispositivi a livello locale. Una rete locale può anche essere estesa a livello cittadino, o regionale. Essa ha un *numero limitato di nodi*!

`Backbone LAN` –> Lan dedicate a collegare tante altre reti. Sono dorsali informatiche che permettono la comunicazione ad alta velocità (solitamente tramite fibra ottica) tra due punti anche molto distanti tra di loro. Sono di proprietà delle grandi aziende di telecomunicazioni. In Italia, uno dei principali backbone network è la rete universitaria GARR che collega attraverso reti sottomarine in fibra ottical’università Federico II di Napoli alla città di New York.

### Scheda di rete

Un host connesso a internet ha un dispositivo fatto apposta per il protocollo H2N, prende il nome di “scheda di rete”. La scheda di rete si occupa del frame (in certi casi anche di una minima parte della logica), mentre solitamente il sistema operativo si occupa solo delle **informazioni logiche**. Quindi in realtà quando si parla di H2N non bisogna immaginarsi il dispositivo (pc, tablet) ma la vera e propria scheda di rete.

### Topologie

1.  `BUS` –> Consiste in un cavo che collega tutti gli host, i messaggi vengono inviati a tutti gli host come segnali elettrici, ma accettati solo dal reale destinatario. Il problema è che se il cavo si rompe in qualsiasi punto, la rete si rompe e non funziona più.
2.  `ANELLO` –> Un host che riceve un pacchetto si chiede se il pacchetto è destinato a lui. Se non è per lui, quell’host **inoltra** il pacchetto! L’host destinatario assorbe il pacchetto quando gli arriva.
3.  `STELLA` –> Gli host sono connessi ad un dispositivo centrale dedicato. Si riescono a raggiungere distanze maggiori (due host possono essere distanti “2 cavi”). La rottura di un collegamento provoca solo l’interruzione della connessione con un host. Il problema è che se si rompe il dispositivo centrale (o si congestiona) la rete si rompe o si rallenta.

### Protocollo Ethernet

Protocollo per realizzare **reti locali**. (Nello stack TCP/IP siamo sempre nel livello h2n.) Questo protocollo era inizialmente progettato per funzionare su reti cablate con **topologia a BUS** (velocità nell’ordine dei Mbit, quando venne ideata). Ora le schede di rete reggono velocità anche a livello di Gbit. Teoricamente il protocollo Ethernet può essere implementato anche con cavi ottici. In realtà al giorno d’oggi questo protocollo è usato con topologia a stella, molto più sicura e diffusa.

-   Il cavo bus deve avere due “terminatori” che assorbono la corrente.
-   **Motivi del successo di ethernet:**
    1.  Poco costosa;
    2.  Flessibile e si presta a diverse tecnologie/topologie;
    3.  Rapida diffusione iniziale che ha preso il controllo del mercato;

Vediamo ora alcuni aspetti fondamentali del protocollo ethernet:

**`Indirizzo MAC`**:

Gli indirizzi MAC sono gli identificatori usati nel protocollo ethernet.

Esempio: 81:F4:A3:AA:9C:49 –> 6 byte (8 bit ogni coppia). Questo tipo di indirizzo è detto **flat**: le cifre non hanno un valore “posizionale”. Soltanto i primi 3 byte servono per identificare il produttore della scheda di rete: con questo stratagemma si evita di generare indirizzi hardware uguali tra produttori diversi.

Questi indirizzi valgono **per la stessa rete locale**. Ovviamente la rete funziona correttamente se questi indirizzi sono **univoci**! Ogni indirizzo MAC è associato ad un’interfaccia di rete (a livello Hardware). Essenzialmente viene scritto all’interno della scheda di rete dal produttore stesso.

Non ci sono misure forti che permettono a chi controlla l’host di “camuffare” l’indirizzo MAC che il sistema operativo usa per inviare i pacchetti.

-   FF-FF-FF-FF-FF-FF: **indirizzo di broadcast**, serve per identificare comunicazioni broadcast in reti ethernet.

All’interno del **frame** del pacchetto inviato viene inserito l’indirizzo MAC del destinatario. In una topologia BUS, a livello elettrico tutti ricevono fisicamente il pacchetto, a livello logico lo riceve soltanto il destinatario. Di default, l’interfaccia di rete confronta il suo indirizzo MAC con quello inserito all’interno del frame. Ci sono alcune eccezioni:

-   Il frame contiene l’indirizzo destinatario broadcast;
-   Sull’host sta eseguendo un software di sniffing. In questo caso l’interfaccia di rete si dice in modalità **promiscua**.

L’indirizzo IP non basta da solo principalmente per 2 motivi:

1.  Se l’indirizzo IP fosse salvato nella NIC al posto dell’indirizzo MAC, quando il dispositivo si connette ad una diversa rete locale, quell’indirizzo all’interno della scheda dovrebbe essere riconfigurato ogni singola volta!
2.  Le NIC non sarebbero in grado di sopportare protocolli diversi da IP.

**`Frame Ethernet`**:

1.  **Preambolo**: sequenza di 8 byte che serve alle interfacce di rete per comunicare correttamente a livello fisico. (“Framing”) L’ultimo byte è una sequenza che indica la fine del preambolo, l’ultimo bit di questa ultima sequenza è sempre 1. Del preambolo si preoccupa solo l’interfaccia di rete, poi quella sequenza viene “scartata”, il S.O. non se ne preoccupa.
    
2.  **Indirizzo destinatario** (6 byte): se in questo indirizzo tutti i byte sono settati a 1 allora il frame ethernet è detto frame **broadcast**.
    
3.  **Indirizzo sorgente** (6 byte);
    
4.  **Camp tipo** (2 byte): serve a implementare il **multiplexing**. Serve al sistema operativo (destinatario) per capire cosa fare del pacchetto ricevuto. (Devo essere in grado di collegare i vari livelli, devo “codificare” che payload sto trasportando). In altre parole, serve all’adattatore per sapere a quale dei protocolli dello strato di rete debba essere passato il campo dati di ciascun frame ricevuto.
    
5.  **CRC**: Informazione di controllo che si trova dopo il pacchetto dati. Per questo si parla di “frame”, perchè il payload viene “circondato”. Il CRC serve per controllare l’integrità del paccheto: viene calcolato dall’interfaccia di rete del mittente durante l’invio del pacchetto con un algoritmo (detto a sua volta CRC). Il destinatario calcola a sua volta il CRC (in base ai dati che gli arrivano) e lo confronta con il CRC ricevuto. Se i due valori coincidono, allora la trasmissione è avvenuta correttamente.
    
    Il CRC(Controllo di Ridondanza Ciclico) viene generato sulla base del contenuto di 2,3,4 e dei dati (payload).
    

Il payload (dati) si trova tra la 4 e la 5 sequenza.

**`MTU`**: (*Maximum Transfer Unit*) Dimensione massima trasferibile sulla rete, a livello di pacchetto. (solitamente 1500 byte) Il livello H2N usa lo **stuffing** per “completare” i pacchetti che hanno dimensione minore di 46 byte. Tutte le schede di rete di una rete ethernet devono essere configurate con la stessa MTU! (essendo un campo comunque variabile, un amministratore di rete potrebbe decidere di cambiarne il valore)

**`Protocollo ARP`**: (*Adress resolution protocol*)

Di base quando si vuole inviare un pacchetto ad un host, non si conosce l’indirizzo MAC del destinatario. Il protocollo ARP prende come in input l’indirizzo IP del destinatario, e come output ha l’indirizzo MAC del destinatario.

-   **Richiesta ARP**: messaggio broadcast che ha come payload l’indirizzo IP che l’host sta cercando. Questo messaggio viene ricevuto da tutti gli host connessi alla rete, ma l’unico che risponde è chi ha l’indirizzo IP ricercato. La risposta contiene l’indirizzo MAC associato a l’indirizzo IP iniziale.
    
    **La risposta è unicast**, il destinatario manda il MAC adress solo a chi l’ha richiesto.
    
    Questo modo di richiedere un indirizzo MAC è effettuabile soltanto su una rete **contenuta**: è difficile mandare un messaggio broadcast saturando una rete che connette troppi host. I pacchetti usati per richieste / risposte ARP sono pacchetti “assestanti” soltanto a livello h2n, non hanno un livello 3. Per questo è un “sottoprotocollo” dell’Ethernet.
    
    Il fatto che non sia riuscito ad ottenere l’indirizzo MAC del destinatario (nel caso in cui effettivamente non ci sia), è un’informazione implicita che si ottiene grazie ad un “**timeout**”.
    
-   **ARP Table**: cache che conserva il mapping IP-MAC per un certo periodo di tempo, per migliorare la performance. La ARP cache è gestita totalmente a livello di sistema operativo. Un amministratore potrebbe voler configurare staticamente delle associazioni IP-ARP, nel caso in cui la rete sia fissa e non avvezza a cambiamenti di varia natura.
    
    Esempio di una entry:
    

| Indirizzo Ip | Indirizzo MAC | TTL |
| --- | --- | --- |
| 222.222.222.221 | 88-B2-2F-54-1A-0F | 13:45:00 |

**`Protocollo CSMA/CD`**:

Protocollo di accesso al mezzo che serve per rilevare le collisioni tra pacchetti nelle reti ethernet. Nelle reti wifi si vuole evitare la collisione, il suo protocollo prende infatti il nome di CSMA/CA –> (*Collision Avoidance*), più complesso e costoso!

-   **Carrier sense**: L’interfaccia di rete prima di iniziare a inviare pacchetti si mette in ascolto, cerca di capire se qualcuno sta già trasmettendo;
-   **Listen while talking**: le interfacce di rete cercano di rilevare segnali in ingresso anche durante la trasmissione. In tal caso si assume che avvenga una collisione, quindi l’interfaccia si ferma di inviare dati. –> L’interfaccia invia un segnale **JAMMING**, anche tutte le altre interfacce si mettono in pausa!
-   **Inter Frame Gap (IFG)**: lunghezza del pacchetto dati più piccolo. I frame emessi da un host sono distanziati da un Inter Frame Gap, in modo da permettere agli altri host di capire la fine di un frame e l’inizio di un altro. Un host prima di iniziare a trasmettere su un canale, sta in ascolto per la durata di un IFG in modo da capire se il canale sia libero o meno.
-   **Ritardo pseudo-casuale** –> si ri-inizia a inviare i pacchetti applicando un ritardo casuale che si spera sia diverso per i vari segnali.
-   **Binary Exponential Back-off (BEB)** –> algoritmo che decide il delay della trasmissione. Il delay è compreso tra \[0, 2^n-1\], quindi aumenta esponenzialmente ad ogni “stop”.

![](/ox-hugo/BEB.png)

Il calcolo viene effettuato in base alla velocità della rete, non si lavora mai con tempi assoluti. Aumentando esponenzialmente la grandezza dell’insieme di valori da cui si sceglie il ritardo di trasmissione, l’host riesce a riadattare la trasmissione al traffico che attualmente è presente nella rete. In presenza di sovraccarico, ovviamente il ritardo di trasmissione è molto alto!

### Tipi di dispositivi

**`Hub`** (l1): ripetitore di segnale, sono deprecati. Funge da centro stella, ogni volta che gli arrivano segnali elettrici lui li replica e lo manda su tutte le porte. Replica anche le collisioni!

**`Switch`** (l2): consentono un **inoltro selettivo** dei frame: più host possono comunicare contemporaneamente nella stessa rete. Gli unici dati che lo swtich legge del frame ethernet sono gli indirizzi MAC.

-   **store and forward**: gli switch solitamente prima di inoltrare il pacchetto lo memorizza per analizzarlo. Se uno switch finisce la memoria (in caso di congestione) alcuni pacchetti potrebbero essere persi/eliminati. Questo meccanismo permette allo switch di gestire le collisioni fisiche!

1.  **filtraggio**: tabella di filtraggio che conserva la corrispondenza tra indirizzo MAC dell’host, la porta a cui è collegata e il tempo di vita di questa informazione. Inizialmente uno switch un hub che cerca di ottenere informazioni sugli host collegati alle sue porte. Da non configurato inoltra a tutti e inizia ad auto-apprendere in base ai pacchetti che gli arrivano.

1.  **inoltro** dei frame al MAC adress corretto.

Se ad uno switch arrivano delle richieste provenenti da due host (uno malevolo che ha copiato il MAC adress di un altro) con lo stesso indirizzo MAC, lo switch si auto-configura ogni volta! Ovviamente alcuni swtich più costosi hanno dei meccanismi di difesa più complessi.

Se uno switch riceve pacchetti da troppi mac adress differenti, finisce la memoria e non riesce più ad aggiornare la tabella di filtraggio. In tal caso, lo switch torna a lavorare come un hub, inoltrando i pacchetti a tutte le porte!

-   **paradigma cut-through**: Il frame viene inoltrato all’address destinatario senza aspettare che il frame arrivi completamente. Questo aumenta le prestazioni, ma permette meno funzionalità (come l’implementazione del controllo di integrità CRC, che a volte è invece implementato in alcuni switch.);

**`Bridge`** (l2): implementa tutta la logica degli switch, ma con alcune funzionalità aggiuntive.

1.  **Bridging trasparente**: se si mettono in collegamento a livello 2 dei protocolli H2N differenti. Permette ad esempio l’inoltro di pacchetti tra protocollo ethernet e protocollo wi-fi. Quindi il sistema di indirizzamento è lo stesso.
    
2.  **Bridging non trasparente**: in grado di lavorare con logiche di “conversione” di protocolli di comuncazione. Sono molto meno popolari.
    
3.  **Bridging virtuale**: switch che funzionano su interfacce virtuali. Nonostante sia essenzialmente uno switch, viene chiamato gergalmente “bridge”.
    

Esistono anche dispositivi come gli **splitter**, molto economici e utili per far partire due cavi da uno solo di ingresso.

### Interconnesioni di LAN

Una soluzione tipica per creare reti estese è quello di creare delle reti LAN multi livello. Gli switch usati nei diversi livelli possono anche essere di diversa natura, alcuni possono essere più veloci di altri in base alle esigenze. Nel caso qui presentato, lo switch centrale deve essere più potente degli altri. Anche le singole porte degli switch possono reggere diverse velocità.

![Rete Lan multilivello](/ox-hugo/interconnessione.png "Rete Lan multilivello")

In una rete del genere, un guasto potrebbe impattare il funzionamento di una grossa parte della rete. Per questo a volte si potrebbero creare delle reti con percorsi ridondanti, in modo da dare percorsi alternativi ai pacchetti.

-   Problema: in presenza di reti **cicliche**, i messaggi broadcast circolano all’infinito!
-   Soluzione: `spanning tree protocol` –> in una rete con dei collegamenti ridondanti vengono disabilitati un certo numero di link sufficiente a rimuovere i cicli! Quindi serve una “logica” che possa aiutare a individuare questi cicli, usando dei messaggi sonda.

Il problema del protocollo ARP rimane: i messaggi broadcast impallano la rete!

---

## (HTN) INTERCONNESSIONI DI RETE E ACCESSO A INTERNET

[–> TOC](#table-of-contents)

### Intro

*Ci avviamo verso il livello 3, ma senza abbandonare il livello 2…*

Cerchiamo di capire come gestire reti **indipendenti** e **eterogenee**; Internet è una **rete globale**: permette la comunicazione tra (*i*) dispositivi e tra (*ii*) reti! Lo scopo, alla fine, è quello di far comunicare in modo trasparente un *client* e un *server*, che sono nodi della rete. Internet può ad esempio essere visto come insieme di **Autonomus Systems**, oppure un’insieme di **nomi**.

Approfondimento sugli **Autonomus System**

📃 [Autonomus Systems (telegram)](https://theelandor.github.io/prova/reti/aut_system.html)

Alcuni principi che bisogna seguire:

-   **Survivability** (*resilienza*): se tra due host esiste un percorso, la comunicazione tra quei due host deve funzionare. Quindi ad esempio in caso di guasto di una via, bisogna essere in grado di sfruttarne un’altra.
-   **Forma a clessidra**: IP implementa il minimo che serve per far funzionare la rete globale. Le funzionalità aggiuntive vengono spartite negli altri livelli dello stack $\rightarrow$ IP è un protocollo **non affidabile**.
-   **Mancanza di stato**: l’intelligenza della rete è mantenuta sugli host e non sui router. Questo è permesso grazie al *packet switching*: al contrario, nelle reti telefoniche, l’intelligenza era nella rete, mentre ai bordi i dispositivi erano molto semplici (dispositivi elettro-meccanici).
-   **Net neutrality**: ogni pacchetto deve essere gestito allo stesso modo, indipendentemente dal tipo di dato o dal tipo di connessione ad esempio. Questo principio, per motivi di varia natura, attualmente non è sempre rispettato.

### Connessioni xDSL

Metodo maggiormente utilizzato attualmente: il mio pc è collegato alla centrale telefonica (cabina in strada), a sua volta collegata **digitalmente** alla rete della compagnia telefonica corrispondente. Il **`Protocollo PPP`** è stato appositamente pensato per collegamenti punto-punto nell’accesso residenziale.

### PPP (approfondimento)

Protocollo(di livello 2) appositamente creato per la gestione dei collegamenti point-to-point, ad esempio nelle connessioni cablate xDSL.

1.  **Modularità**: supporta molti protocolli nei livelli superiori.
2.  Supporto all'**autenticazione**: garanzia non scontata a livello di sicurezza!
3.  **Rilevamento di errori** (non risoluzione), molto importante in quasi ogni protocollo.
4.  Supporto all'**IP Dinamico**:

**`Metodo di incapsulazione`**: PPP deve saper ricevere pacchetti di varia natura e trasmetterli correttamente. 2 componenti principali: (*i*) Link Control Protocol e (*ii*) Network Control Protocol

-   **Link Control Protocol** –> relativa al mezzo fisico;
-   **Network Control Protocol** –> comunicazione con il livello IP;

**`Principi del PP`**:

1.  **Packet Framing** con **Bit transparency**: il protocollo PPP deve riuscire a trasferire dati binari di qualsiasi natura.
2.  **Connection liveness**: individua problemi a livello di link, nel caso viene comunicato un errore a livello 3.
3.  **Error detection**, già accennato prima;
4.  **Network Layer address negotiation**: viene fornito supporto ai diversi protocolli di rete comunicanti per configurare gli indirizzi di rete. (“Si configura il livello 3 a partire dal livello 2”)

Nonostante questo protocollo debba funzionare su dispositivi dedicati, è abbastanza complesso e con molte funzionalità. Alcune funzionalità di cui **NON** si occupa il PPP:

1.  **Error Correction**;
2.  **Flow Control**: quando la connessione viene stabilita (ad esempio da casa mia alla centralina), si stabilisce un “tasso nominale” di velocità che però *non viene verificata* da parte di PPP. Questo non toglie che il controllo non venga effettuato in altri livelli dello stack.
3.  **Sequence**: l’ordine dei pacchetti non viene verificato.

**`Fasi principali di una connessione`**

1.  Stabilire la **connessione**: quando intendo comunicare delle informazioni, prima apro una connessione aprendo un canale. Si usa quindi un paradigma diverso dal “packet switching”, dato che abbiamo un canale dedicato.
2.  **Autenticazione**, che in alcuni casi è facoltativa.
3.  **Configurazione** del protocollo di rete.
4.  (fase di comunicazione)
5.  **Terminazione**

Dato che si usa un protocollo orientato alla connessione, si può suddividere quest’ultima in diverse fasi (Figura 6)

![PPP, automa a stati finiti](/ox-hugo/autome.png "PPP, automa a stati finiti")

**`Data Frame del PPP`**

![Frame del protocollo PPP](/ox-hugo/pppframe.png "Frame del protocollo PPP")

**`Byte Stuffing`**

Tecnica che si usa per distinguere il byte <01111110> “flag” dallo stesso byte se è un dato logico. Per farlo, aggiunge un byte extra analogo prima di ogni byte (<01111110>) dato. E' una sorta di operazione di “escaping”: il destinatario se trova due byte (<01111110>) di fila, scarta il primo, il secondo lo considera “dato” e continua la ricezione.

---

## VLAN

📃 [VLAN](https://theelandor.github.io/prova/reti/vlan.html)

## (IP) Livello IP

[–> TOC](#table-of-contents)

### Indirizzo IP

32 bit –> 4 byte, più piccolo di un’indirizzo MAC! Si usa una dotted notation, in cui ogni numero (in decimale) rappresenta un byte. Indicativamente quindi si possono generare circa 4 miliardi di indirizzi $(2^{32})$. In questo caso si parla di **`IPv4`**.

Per quando riguarda questo corso, studiamo degli indirizzi di *lunghezza fissa*, indipendentemente dal contesto o tipo di comunicazioni. La lunghezza variabile potrebbe permettere di avere più flessibilità, ma i costi a livello di comunicazione sono troppo alti e svantaggiosi.

Lo spazio di indirizzamento è **gerarchico** e strutturato, a differenza ad esempio di ethernet (ricordiamoci dei problemi legati ai messaggi ARP broadcast che rischiano di intasare la rete). Le gerarchie fanno si che si possano inviare i dati in modo selettivo in contesti anche complessi.

Gli indirzzi IP sono indirizzi **logici**, e possono essere:

1.  Assegnati a ogni host **permanentemente** (in modo statico);
2.  Assegnati **dinamicamente**, ad esempio al momento del boot;

Un classico esempio di un dispositivo che necessita di un indirizzo statico è un server, che deve fornire un servizio permanente e accessibile. Al contrario, noi utenti, spesso usiamo dei protocolli per ottenere l’indirizzo dinamicamente. Ovviamente, assegnamo l’indirizzo IP ad un’interfaccia di rete. Tuttavia, ogni interfaccia può avere diversi indirizzi IP.

-   Perchè c’è bisogno anche di un indirizzo fisico oltre all’indirizzo logico? –> per motivi di performance: in modo da poter “delegare” all’hardware alcune funzionalità specifiche (il filtraggio, ad esempio)! Queste stesse funzionalità potrebbero anche essere gestite a più alto livello, ma potrebbero risultare più lente essendo implementate a livello software.

### Componenti dell’Indirizzo IP

In questo caso i byte hanno un valore posizionale per garantire la scalabilità e una struttura gerarchica:

1.  Network ID
2.  Host ID

Gli indirizzi IP sono gestiti per “insiemi”. Spesso indirizzi IP simili corrispondono ad host vicini geograficamente e logicamente tra loro.

### Indirizzi IP *speciali*

-   **`Network Address`**: **155.185.0.0** $\rightarrow$ la parte dell’indirizzo relativa all’host ha tutti i byte pari a 0.
    
-   **`Indirizzo di Broadcast`**: **128.211.255.255** $\rightarrow$ la parte dell’indirizzo relativa all’host ha tutti i byte con bit pari a 1. Questo messaggio può essere destinato ad una qualsiasi rete.
    
-   **`Limited Broadcast Adress`**: **255.255.255.255** $\rightarrow$ tutti i bit settati a 1. Permette di mandadre un messaggio broadcast sulla rete fisica locale. Un pacchetto con questo indirizzo IP *non viene* inoltrato dai router, perchè è destinato soltanto alla rete locale, è simile ad un arp request.
    
-   **`This Host on This Network`**: 0.0.0.0 $\rightarrow$ tutti i bit settati a 0. Identifica un host non ancora configurato correttamente.
    
-   **`Loopback Address`**: **127.0.0.1** $\rightarrow$ permette la comunicazione a livello internet sulla stessa macchina, localmente. *Tutti gli indirizzi di loopback iniziano per 127*!
    
-   **`Indirizzi privati`** ammissibili: indirizzi *non routable*, che possono essere usati localmente senza autorizzazione. (*i*) 10.0.0.0/8 (*ii*) 172.16.0.0/12 (*iii*) 192.168.0.0/16
    

**`Natting`** –> se ho una rete privata ma voglio comunicare con una rete esterna, che magari non accetta gli indirizzi IP locali. E' una funzione offerta dal router locale. 📃 [Approfondimento Natting](https://theelandor.github.io/prova/reti/ip_header_nat.html)

### Gestione indirizzi e domini

**`Jon Postel`** \[1943-1998\]: definito *lo zar dei numeri*, direttore di **IANA**, si occupava di garantire gli standard di internet. Uno dei compiti di IANA, era quello di garantire la corretta gestione degli indirizzi IP, la loro unicità e la loro corretta struttura gerarchica. Data la decentralizzazione di internet, la IANA cerca di delegare i compiti ai provider di internet internazionali. Per prima cosa, si creano delle sotto-associazioni che gestiscono dei “blocchi” di indirizzi IP, a livello geografico (quindi “asegnando” i *Network ID*). A loro volta verrano istituiti dei provider nazionali, regionali, e così via.

**`Classi di Indirizzi IP`**: differenziano il numero di byte assegnati al netid. Per classificarli e riconoscerli, hanno delle sequenze iniziali distintive. Ad esempio, gli indirizzi che iniziano con 10 sono di classe B, quindi hanno i primi 2 byte dedicati al netid. Quelli di classe C i primi 3 byte, ecc… Le 3 classi più interessanti, che tratteremo in questo corso, sono A,B,C.

![Classi di Indirizzi IP](/ox-hugo/classi.png "Classi di Indirizzi IP")

![Dimensioni delle classi di indirizzi](/ox-hugo/classi2.png "Dimensioni delle classi di indirizzi")

Queste classi di indirizzi erano pensate per essere assegnate ai diversi internet service provider. Ovviamente, negli anni sono entrati in scena aspetti economico/politici: gli ISP comprano una determinata classe in base al bisogno di connettività che devono fornire ai loro utenti.

Tendenzialmente i gestori di classi A sono grossi paesi o grosse aziende (*o ricche*, ~che a volte nemmeno ne hanno bisogno~ ) come Apple, IBM, IANA, e altre.

**`Indirizzi Classless`**: per motivi gestionali e di flessibilità, spesso si può indicare esplicitamente quale parte dell’indirizzo è dedicata al N.ID o H.ID. Per fare questo tipo di ripartizione, si usa la notazione **`CIDR`** $\rightarrow$ **a.b.c.d/n**

Esempio di indirizzo classless: 192.168.1.1/23

### Formato del datagramma IP

Ogni pacchetto IP può essere lungo fino a 64kbyte. Sicuramente nell’header sono contenuti (*i*) indirizzo sorgente (*ii*) indirizzo destinazione. Se si pensa all’interità dello stack, ci si ricorda che questo pacchetto verrà passato ai livelli sottostanti prima di essere trasmesso, quindi al livello ethernet. La grandezza massima del frame ethernet era determinata dall’M.C.U: in ogni caso non poteva superare i 1500byte. Come faccio quindi a incapsulare un pacchetto grande fino a 64KByte?

–> Esistono 2 approcci per risolvere questo problema:

1.  Faccio in modo che questo pacchetto IP sia più piccolo e possa essere incapsulato;
2.  Si cerca di **frammentare** il datagramma IP, quindi bisogna fornire delle informazioni all’interno del datagramma che possano servire all’host che riceve il frammento per “ricostruire” l’intero pacchetto.

![Formato del datagram IP](/ox-hugo/ipdatagram.png "Formato del datagram IP")

-   **VERS** –> informazioni sulla versione;
-   **HLEN** –> lunghezza dell’header del datagram, si suppone una certa flessibilità del protocollo.
-   **Service type** –> bitmap che comunica delle informazioni relativi al pacchetto. In Figura 11 si può vedere meglio la struttura di questa sequenza lunga 8 bit.
-   **Identification** –> intero che identifica il datagram;
-   **Flags** –> flag che segnalano la frammentazione;
-   **Offset** –> identificano il frammento rispetto al pacchetto originale;
-   **Time to Live** –> contatore che ci mostra quanti router questo pacchetto può percorrere prima di essere scartato.
-   **Protocol** –> contiene informazioni verso il livello 4, indica quale protocollo può usare i dati contenuti nel datagram.
-   **Checksum** –> controllo di integrità sull'*header*, quindi non ci si preoccupa per ora del payload. (Come al solito, in IP ci si mantiene il più leggeri possibili).
-   **Ip-options** –> campo opzionale di grandezza variabile, serve per fare debugging di rete.
-   **Padding** –> serve per fare in modo che l’intero header abbia lunghezza che sia un multiplo di 32 bit. Simile al “byte stuffing”.

![Service type sequence](/ox-hugo/typeofs.png "Service type sequence")

## (IP) Subnetting

-   📃 [Subnetting](https://theelandor.github.io/prova/reti/subnetting.html)

## (IP) Ip routing

-   📃 [IP routing](https://theelandor.github.io/prova/reti/ip_routing.html)
-   📃 [Ip routing 2](https://theelandor.github.io/prova/reti/ip_routing_2.html)

---

## BGP

Breve introduzione al protocollo BGP:

-   📃 [BGP](https://theelandor.github.io/prova/reti/bgp.html)

## (TCP)

-   📃 [Livello 4, 15/11/22, UDP e intro a TCP](https://theelandor.github.io/prova/reti/151122.html)
-   📃 [Livello 4, 22/11/22, segmento TCP, TWH](https://theelandor.github.io/prova/reti/221122.html)
-   📃 [Livello 4, 29/11/22, TCP, Sliding Window](https://theelandor.github.io/prova/reti/tcp2.html)

## DNS

-   📃 [DNS, 06/12/22](https://theelandor.github.io/prova/reti/061122.html)

## DHCP

-   📃 [DHCP, teoria+minilab, 12/12/22](https://theelandor.github.io/prova/reti/121222.html)

## Security

-   📃 [Intro security](https://theelandor.github.io/prova/reti/sec.html)
-   📃 [Public Key Distribution](https://theelandor.github.io/prova/reti/sec2.html)
-   📃 [Stack of Secure Protocols](https://theelandor.github.io/prova/reti/sec3.html)

## Email

-   📃 [Posta elettronica](https://theelandor.github.io/prova/reti/email.html)

## Lab 6-10

[–> TOC](#table-of-contents)

-   **`Collegamenti dritti`**: si usano quando si vogliono collegare dispositivi che lavorano a livelli diversi dello stack TCP/IP, come un host e uno switch.
-   **`Collegamenti incrociati`**: quando si collegano dispositivi che lavorano allo stesso livello dello stack TCP/IP, come due host o due switch.

### ifconfig

Si usa il comando **ifconfig** per mostrare le interfacce attualmente *attive* nell’host. Alcune flag/opzioni utili:

-   **\-a**: mostra tutte le interfacce, anche le non attive. (i) **lo** è un’interfaccia virtuale locale che il SO usa per le comunicazioni tra processi locali.
    
-   **<nome\_interfaccia>**: mostra le informazioni sull’interfaccia specificata; (i) HWaddr è il MAC adress dell’interfaccia; (ii) MTU è la maximum transfer unit;
    

### ip

Si usa il comando **ip** per interagire con lo stack TCP/IP. Per lavorare a livello 2 si usa il comando **ip link**. Esso elenca tutte le interfacce di rete disponibili nel sistema, simile al comando `ifconfig -a`.

```bash
eros@eros-ThinkPad-T430:~/website$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
	link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp0s25: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN mode DEFAULT group default qlen 1000
	link/ether 28:d2:44:0e:4e:f4 brd ff:ff:ff:ff:ff:ff
3: wlp3s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DORMANT group default qlen 1000
	link/ether 6c:88:14:86:08:08 brd ff:ff:ff:ff:ff:ff
4: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN mode DEFAULT group default
	link/ether 02:42:f5:40:4e:45 brd ff:ff:ff:ff:ff:ff
```

-   **ip link show eth0** per ottenere informazioni su quell’interfaccia di rete;
-   **ip link set eth0 up** per accendere l’interfaccia;
-   **ip link set eth0 down** per spegnere l’interfaccia;

### Come configurare una rete

1.  Per prima cosa bisogna assegnare l’indirizzo IP all’interfaccia. Eseguire questo comando corrisponde anche all’accensione dell’interfaccia. Dopo l’esecuzione del comando, sull’output di ifconfig compare la linea corrispondente alle informazioni degli indirizzi ip.
    
    ```bash
    ifconfig eth0 192.168.1.1
    ```
    
    Per spegnere l’interfaccia e rimuovere l’indirizzo ip:
    
    ```bash
    ifconfig eth0 0 down
    ```
    
    Per vedere gli indirizzi assegnati ad un interfaccia:
    
    ```bash
    ip addr show dev eth0
    ifconfig eth0
    ```
    
    Per aggiungere un indirizzo ip ad un interfaccia. In questo caso devo sia assegnare l’indirizzo che attivare l’interfaccia. ifconfig invece lo fa in automatico, per questo a volte risulta più comodo. Il comando ip è pensato per gestire più indirizzi IP in una stessa interfaccia, quindi risulta più articolato. Usando il comando `ifconfig eth0 0 down` viene spenta l’interfaccia e rimosso soltanto *il primo* indirizzo ip.
    
    ```bash
    ip addr add dev eth0 192.168.1.1/24
    ```
    
2.  Dopo aver acceso le interfacce e aver assegnato l’indirizzo IP, si può testare la connessione usando `ping`. Se questa operazione ha successo, si può consultare l'*arp table* usando uno di questi due comandi:
    
    ```bash
    root@m1:~# arp
    Address                  HWtype  HWaddress           Flags Mask            Iface
    192.168.1.4              ether   02:04:06:1b:57:4b   C                     eth0
    192.168.1.3                      (incomplete)                              eth0
    
    root@m1:~# ip neigh
    192.168.1.4 dev eth0 lladdr 02:04:06:1b:57:4b STALE
    192.168.1.3 dev eth0  FAILED
    ```
    
    Può tornare utile il comando `ip neigh flush all`, che pulisce l’arp table.
    
3.  **ifupdown** –> tool che serve per configurare in modo permanente la configurazione di una macchina. Prima di agire, conviene resettare le configurazioni temporanee.
    
    La configurazione è contenuta nel file /etc/network/interfaces. In questo modo le informazioni date configurano la rete come se fosse stato usato ifconfig. Ecco un semplice esempio di configurazione
    
    ```bash
    root@m2:~# cat /etc/network/interfaces
    # interfaces(5) file used by ifup(8) and ifdown(8)
    # Include files from /etc/network/interfaces.d:
    source-directory /etc/network/interfaces.d
    
    auto eth0
    
    iface eth0 inet static
    address 192.168.1.1
    ```
    
    -   auto –> la configurazione si attiva al boot;
    -   per attivare immediatamente la configurazione dell’interfaccia di eth0 si può usare il comando `ifup eth0` ;
    -   per disattivare la configurazione permanente dell’interfaccia di eth0 si usa `ifdown eth0`;

### TMUX

Alcuni comandi utili per la gestione delle finestre:

```text
- logout --> ctrl-d
- modalità comandi --> ctrl-b
- detach --> CMD + d
- split verticale --> CMD + %
- split orizzontale --> CMD + "
- spostamento --> CMD + freccina
- scroll --> CMD + pageup/pagedown
- nuova finestra --> CMD + c
- scelta finestra --> CMD + numero
```

### tcpdump e ping

Tool usato per sniffare il traffico di rete di una determinata scheda. (i) -e sta per ethernet, in modo da limitarsi alle informazioni del livello 2. (ii) -i serve per specificare l’interfaccia. Esempio di output:

```bash
root@m2:~# tcpdump -nei eth0
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
10:53:49.007880 02:04:06:9c:eb:4a > ff:ff:ff:ff:ff:ff, ethertype ARP (0x0806), length 42: Request who-has 192.168.1.2 tell 192.168.1.1, length 28
10:53:49.007905 02:04:06:1b:57:4b > 02:04:06:9c:eb:4a, ethertype ARP (0x0806), length 42: Reply 192.168.1.2 is-at 02:04:06:1b:57:4b, length 2
```

Può essere utile anche il comando `arping`: il test di connessione viene effettuato mandando tante richieste ARP, consecutivamente.

```bash
root@m1:~# arping -i eth0 192.168.1.2
root@m2:~# tcpdump -nei eth0
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
10:56:56.242261 02:04:06:9c:eb:4a > ff:ff:ff:ff:ff:ff, ethertype ARP (0x0806), length 42: Request who-has 192.168.1.2 tell 192.168.1.1, length 28
10:56:56.242283 02:04:06:1b:57:4b > 02:04:06:9c:eb:4a, ethertype ARP (0x0806), length 42: Reply 192.168.1.2 is-at 02:04:06:1b:57:4b, length 28
```

---

## Lab 20-10

[–> TOC](#table-of-contents)

### Introduzione

Lo scopo è quello di configurare 2 reti locali separate, con un host centrale che fa da router.

![](/ox-hugo/router.png)

**LAN1: 192.168.1.0** Quindi gli indirizzi ip vanno da 192.168.1.1 a 192.168.1.254, perchè 192.168.1.255 è un’indirizzo speciale non assegnabile (di broadcast);

**LAN2: 192.168.2.0**

### Configurazione (temporanea)

-   **H1** –> `ifconfig eth0 192.168.1.1/24`. Per essere sicuri, è meglio specificare la netmask;

Il router H2 ha due interfacce di rete, vanno configurate entrambe:

-   **H2** –> `ifconfig eth0 192.168.1.254/24` `ifconfig eth1 192.168.2.254/24`

Dato che H2 è il router, deve avere le due interfacce che appartengono alle due reti diverse. E' prassi che il suo indirizzo IP parta dagli ultimi disponibili, in modo da essere riconoscibile ad occhio.

### Tabella di routing

La tabella di routing contiene le informazioni necessarie all’host per poter comunicare in rete. Per visualizzare la tabella di routing, si usa il seguente comando `route -n` $\downarrow$

![](/ox-hugo/h1routing.png)

In questo caso, l’host H1 è solo in grado di comunicare localmente, riesce a inviare pacchetti a indirizzi IP “locali”. Infatti nella tabella è presente solo un record (quindi una regola di routing), applicabile agli indirizzi IP che iniziano con **192.168.1.0**.

-   **Destination**: applico questa riga a tutti i pacchetti destinati all' indirizzo di rete specificato.
    
-   **Genmask**: specifica la netmask degli indirizzi a cui è destinata questa reogla di routing. Dato che nella configurazione di questa interfaccia di rete abbiamo specificato “/24”, la netmask avrà i primi 3 byte tutti settati a 1.
    
-   **Gateway**: 0.0.0.0 significa che il pacchetto va inviato tramite host to network, quindi localmente! Nel caso di questa specifica interfaccia verrà quindi sfruttato il protocollo ethernet.
    
    *Situazione*: da H1 uso il comando ping specificando un generico indirizzo IP.
    
    Cosa succede?
    
    La prima cosa che viene fatta dall’host è il consulto della tabella di routing, per capire cosa fare dei pacchetti che devono essere inviati a quell’indirizzo. Se il gateway ha un valore (diverso da 0.0.0.0) allora il pacchetto va inoltrato tramite il router specificato! Altrimenti il pacchetto viene inviato tramite protocollo ethernet.
    
    Per vedere la tabella di routing i può anche usare `iproute`:
    

![](/ox-hugo/iproute.png)

-   **Scope link** significa che il pacchetto va inviato sfruttando il livello “link”, quindi il livello2. Per eth0 questo livello è ethernet.

> Seguno ora alcuni esempi di comunicazione.

-   da H1 uso questo comando: `ping 192.168.1.2`
    
    –> il sistema cerca di inviare richieste arp, perchè la tabella di routing dice che questo indirizzo dovrebbe essere raggiungibile a livello 2. Nessuno risponde all’arp request, quindi il timeout scade e viene stampato “host unreachable”.
    
-   da H1 uso il comando: `ping 192.168.2.2`
    
    –> ottengo l’errore “Network is unreachable”. Infatti nella tabella di routing non esistono entry che specificano regole per questa destinazione.
    
-   da H1 configuro in modo diverso l’interfaccia, usando `ip addr dev eth0 192.168.1.1`. –> In questo caso, se poi se uso `ping 192.168.1.254`, ottengo *host unreachable*, perchè ip non capisce da solo qual’è la netmask! Infatti essa deve essere necessariamente specificata alla fine dell’indirizzo. In tal caso viene aggiornata correttamente la route table e riesco a pingare un host che si trova sulla rete locale. Con ifconfig invece, anche se la netmask non viene specificata, lui interpreta il comando e capisce che (ad esempio) 192 è l’inizio di un’indirizzo di classe C (per convenzione). Quindi usare **ifconfig 192.168.0.1** è equivalente a usare **ip addr dev eth0 192.168.1.1/24**.
    

Usando invece `ifconfig eth0 10.0.0.1`, l’indirizzo viene di default interpretato come indirizzo di classe A. Esiste un modo per configurare un’interfaccia di rete senza far aggiornare la route table anche usando ifconfig: si usa il comando `ifconfig eth0 10.0.0.1/32`. Alla fine è come se usassi `ip add add dev eth0 10.0.0.1` senza specificare la netmask.

### Configurazione del router

Di base un host non si comporta come un router: infatti se riceve un’indirizzo ip diverso dal proprio esso viene scartato! Bisogna quindi configurare l’host centrale in modo da farlo comportare come un router (che inoltra i pacchetti). In linux si può usare modificando un’opzione del kernel:

```bash
sysctl -w net.ipv4.ip_forward=1
```

Dopo aver fatto ciò, è importante “istruire” gli host di livello 3 della rete, in modo da fargli capire come raggiungere gli indirizzi ip “esterni”, non raggiungibili a livello 2. Bisogna semplicemente aggiungere una regola di routing.

Ci si posiziona su H1 e si lancia il seguente comando, con cui si specifica che per raggiungere la rete 2 si deve passare per il router con indirizzo **192.168.1.254**.

```bash
route add -net 192.168.2.0/24 gw 192.168.1.254
```

![](/ox-hugo/routerconfig.png)

> Seguono ora alcuni esempi di comunicazione.

-   da H1 uso `ping 192.168.2.2`
    
    –> per prima cosa H1 cerca di capire qual’è l’indirizzo del router, che risponde fornendo il suo indirizzo MAC. Dopo aver fatto ciò, invia un pacchetto con IP destinazione **192.168.2.2**, *al router*. Esso inoltra poi il pacchetto e cerca di inviare delle arp request, ovviamente non trovando l’host con l’ip richiesto. Il timeout scade, e viene ritornato un messaggio di errore.
    
-   da H1 uso `ping 192.168.2.1`: –> in questo caso la comunicazione non sembra funzionare. Questo perchè H3 non è ancora configurato per raggiungere H1 per inviare le risposte! In realtà quindi i pacchetti vengono *inviati* correttamente.
    
-   da H3 uso –> `route add -net 192.168.1.0/24 gw 192.168.2.254` a questo punto il comando ping precedente funziona nel suo complesso correttamente!
    
-   da H1 uso `route add default gw 192.168.1.254`: –> molto spesso usata nei contesti reali, quando in una rete locale ho soltanto un router che mi manda verso l’esterno della rete (verso internet); L’host specificato viene usato come **gateway predefinito**;
    

![](/ox-hugo/defaultgateway.png)

In questo caso è ben visibile il record che corrisponde al router di default (Destination –> 0.0.0.0)

-   da H1 uso `ping 192.168.3.1` –> **“Net unreachable”**: il router infatti controlla la sua tabella di routing e non trova una rete compatibile, quindi rimanda indietro l’errore.

Per eliminare una regola di routing si possono usare i seguenti comandi:

```bash
route del -net default
route del -net 192.168.2.0/24
```

Con il seguente comando si specifica una regola di routing per uno specifico host.

```bash
route add -host 192.168.1.254 dev eth0
```

### Configurazione permanente

Sotto viene riportato il file di configurazione di H1. Dopo **post-up** viene specificato un comando che viene eseguito *dopo* l’attivazione dell’interfaccia di rete. Con la specifica **“gateway”** semplicemente si specifica il default gateway.

```text
auto eth0
iface eth0 inet static
  address 192.168.1.1/24
  gateway 192.168.1.254
  post-up route add -net 192.168.2.0/24 gw 192.168.1.254
```

Per configurare H2 invece:

```text
auto eth0 eth1
iface eth0 inet static
  address 192.168.1.254/24

iface eth1 inet static
  address 192.168.2.254/24
```

## Lab 27-10

-   📃 [Laboratorio Subnetting](https://theelandor.github.io/prova/reti/cidr.html)

## Lab 3-11

-   📃 [Laboratorio WLAN](https://theelandor.github.io/prova/reti/031122.html)

## Lab/Lezione 17-11

Breve introduzione sul Natting (telegram + presenza) + Laboratorio in presenza:

-   📃 [Laboratorio Natting](https://theelandor.github.io/prova/reti/ip_header_nat.html)

## Lab/Lezione 24-11

Breve introduzione ai Firewall + Laboratorio:

-   📃 [Laboratorio Firewall](https://theelandor.github.io/prova/reti/241122.html)

## Esercizi

📃 [Esercizio routing 20/10/22](https://theelandor.github.io/prova/es1reti.html)
