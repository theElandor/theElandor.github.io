---
title: "Z340 Decoder in C"
description: "Zodiac Meets C Code"
date: 2025-05-17
tags: ["cryptography", "c"]
---

## Introduction

![Left: Zodiac Identikit. Right: z340 cypher.](/ox-hugo/zodiac.png "Left: Zodiac Identikit. Right: z340 cypher.")

[Zodiac](https://it.wikipedia.org/wiki/Killer_dello_Zodiaco) was a serial killer who operated in California during the 1970s. He gained notoriety not only for his violent crimes but also for the mysterious, encrypted messages he sent to local newspapers. Five victims were killed during hist attacks, and two survived:

-   David Arthur Faraday (17) and Betty Lou Jensen (16) were shot and killed on December 20, 1968, on **Lake** Herman Road in Benicia;
    
-   Michael Renault Mageau (19) and Darlene Elizabeth Ferrin (22) were shot around midnight between July 4 and 5, 1969, in the parking lot of Blue Rock **Springs** Park in Vallejo. Mageau survived the attack; Ferrin was pronounced dead at Kaiser Foundation Hospital;
    
-   Bryan Calvin Hartnell (20) and Cecelia Ann Shepard (22) were stabbed on September 27, 1969, at Lake Berryessa in Napa County; Hartnell survived, but Shepard died at Queen of the Valley Hospital as a result of her injuries on September 29;
    
-   Paul Lee Stine (29) was shot and killed on October 11, 1969, in the Presidio Heights neighborhood of San Francisco.
    

My deepest condolences go out to the families and loved ones of the victims. While it is unlikely that any of them will read this post, I want to make it clear that everything I write here is meant with the utmost respect. My goal is not to sensationalize these tragic events, but to raise awareness about the Zodiac case in the hope that renewed attention might one day help bring the killer to justice.

In recent years, it has drawn renewed attention in Italy, as many believe there may be a [link](https://ostellovolante.com/) to the [Mostro di Firenze](https://it.wikipedia.org/wiki/Mostro_di_Firenze) case. I won’t go in the details of this hypothesis, but trust me, it’s something you should read about.

One of his most infamous ciphers, known as Z340, puzzled both amateur and professional cryptanalysts for decades. In this post, I’ll present a decoder written in C that can decrypt the Z340 cipher using known decryption keys. The decoding process involves applying a transposition matrix followed by a homophonic substitution—two techniques believed to have been used by the Zodiac himself.

I won’t explain how [David Oranchak, Sam Blake, and Jarl Van Eycke](https://arxiv.org/abs/2403.17350) uncovered the encryption method used by the Zodiac, as the process is complex and warrants a dedicated post. However, I will walk you through the basics of the decryption procedure and share a small program I wrote—partly to brush up on my C skills, and partly to ensure I truly understood how the decryption works. If you are willing to dive deeper into this rabbit hole, reading this post will for sure help you.

There is a quote I like from [Krysten Nygaard:](https://it.wikipedia.org/wiki/Kristen_Nygaard_\(matematico\))

> Programming is understanding.

I believe that explaining things with the “input, computation, output” framework is really effective. Here’s a quick overview of the next chapters: In [the first section](#input) I will present you the input of the problem (the cypher). In the [second section](#preprocessing) I show the preprocessing needed to translate the cypher in a machine- compatible language. In the [third section](#decoding) I go through the code and the implementation details. In the [last section](#output-and-conclusions), we examine the output and walk through the conclusions.

## Input

<a id="figure--fig:z340"></a>

![Z340, received on November 8th 1969 by the San Francisco Chronicle newspaper.](/ox-hugo/input1.png "Z340, received on November 8th 1969 by the San Francisco Chronicle newspaper.")

Figure [2](#figure--fig:z340) depicts the cypher that Zodiac sent to the *San Francisco Chronicle* on the 8th of November 1969. Named Z340 for its length (20 rows and 17 columns, for a total of 340 characters) the cypher strictly resembles the previous one, Z408. The latter was received on July 31th of the same year, and was cracked 8 days later by a couple of cryptographers, Donald and Bettye Harden. The following is the solution of Z408:

```text
I like killing people because it is so much fun
- it is more fun than killing wild game in the forest
because man is the most dangerous animal of all -
to kill something gives me the most thrilling experience
- it is even better than getting your rocks off with a girl -
the best part of it is that when I die I will be reborn in
paradise and all the (lone or stray people) I have killed
will become my slaves - I will not give you my name because
you will try to slow down or stop my collecting of slaves
for my afterlife ebeo riet emeth hpiti.
```

To encrypt his message, Zodiac used a tecnique called **Homophonic Substitution**. It’s well known among cryptography experts that using only a 1:1 symbol-to-letter substitution is very vulnerable to **frequency analysis**. In fact, we could simply analyze the frequency of each symbol in the cipher and compare it with the frequency of characters in an English sentence, significantly narrowing down the range of possible solutions. Instead, with homophonic substitution, each english letter is mapped to multiple symbols. This makes the cypher a lot harder to decode. The last sentence of Z408 still remains a mystery, even nowadays.

## Preprocessing

The first step was to assign a number to each of the 63 unique symbols in the cipher, so I could input them into my program. Figure [3](#figure--fig:board1) shows my board after about two hours of mapping symbols to numbers. You’ll notice an empty cell between symbols 32 and 34 — this is because I initially believed there were 64 symbols, but I had misinterpreted one. Unfortunately, I only realized the mistake after completing the translation, so we’ll leave symbol 33 blank.

<a id="figure--fig:board1"></a>

![The symbol table (left) and the cypher in numeric format (right)](/ox-hugo/board1.jpeg "The symbol table (left) and the cypher in numeric format (right)")

I then inserted the table on the right into a text file, which you can find below or in my [GitHub repo](https://github.com/theElandor/Z340) along with the rest of the work.

```text
0 1 2 3 4 5 6 7 8 9 10 11 12 13 38 45 15
16 4 17 18 19 20 21 22 23 24 25 60 27 28 29 30 31
18 32 63 34 35 17 36 37 38 24 19 31 12 20 39 0 40
41 4 4 42 6 5 43 28 7 41 4 21 17 17 2 29 45
47 48 35 17 39 49 50 15 10 46 51 8 17 52 53 9 54
4 43 2 6 51 5 21 55 28 15 56 9 51 3 45 23 19
20 53 17 29 57 22 58 45 36 34 59 38 7 60 39 12 10
19 38 45 40 30 50 20 21 17 47 16 25 39 17 61 12 48
15 27 35 17 62 17 37 2 45 51 18 34 32 14 26 53 29
55 39 5 36 7 17 6 40 17 21 4 42 27 51 18 32 55
36 17 2 54 46 49 1 10 23 25 18 4 62 13 35 29 21
45 27 34 5 2 40 10 28 46 13 53 35 60 17 8 18 51
39 26 48 41 32 20 17 16 10 46 51 18 34 19 58 43 2
5 38 51 16 6 30 46 45 53 62 60 34 7 53 49 17 17
32 18 59 11 28 63 53 48 56 1 3 7 36 37 46 55 17
10 34 60 44 39 18 29 19 21 4 6 60 30 35 57 38 45
2 34 13 17 12 11 26 56 27 17 51 5 24 18 10 31 12
17 17 31 24 56 39 24 34 8 21 41 0 13 54 19 31 4
10 51 9 15 24 27 42 49 18 47 25 21 18 28 55 56 34
3 35 23 0 16 4 9 41 39 37 21 43 48 10 29 58 17
```

## Decoding

While Z408 was a relatively easy cipher to decrypt at the time, Z340 has been much harder. Indeed, 50 years passed before the solution was finally discovered. During this long period, many people—including mathematicians, computer scientists, cryptographers, and the FBI—analyzed the cipher using a wide range of techniques. One of the main challenges is that, unlike Z408, Z340 likely involves not only substitution but also **transposition**, making the encryption significantly more complex. If you are interested, the original paper by [David Oranchak et.al](https://arxiv.org/abs/2403.17350) provides an in-depth explanation and lists all the efforts and steps that led to the solution. I will go straight to the point, by showing the homophonic substitution key and transposition matrix used by the killer in Figure [4](#figure--fig:matrix-key).

<a id="figure--fig:matrix-key"></a>

![Transposition matrix (left) and homophonic substitution key (right)](/ox-hugo/input2.png "Transposition matrix (left) and homophonic substitution key (right)")

As you can see, the killer divided his cypher in 3 sections. In this post we will focus on section one, since it is the most interesting one (it has no encryption errors). The first section of the cypher includes all of the 17 columns, but only includes rows in the range $[0,9)$. To decode the message, we have to:

1.  Follow the transposition matrix and re-write the cypher;
2.  Replace the symbols (numbers in our case) with characters as shown in the homophonic substitution key;

If we carefully look at the transposition matrix, all we need to do is:

-   For 17 times (number of columns)
    -   Start from the top element in the current column;
    -   Perform a “L” shape move, down 1 step and right 2 steps. If we step out of the matrix, we wrap around in a “pacman” fashion;
    -   Write the symbol that we find;
-   Read the symbols found;

This translates into C code this way:

```c
#define S1_E 9
#define COLS 17
#define ROWS 20
int* transpose_section_1(int (*cypher)[COLS]){
  int *arr = malloc(S1_E*COLS*sizeof(int));
  int index=0;
  for(int s=0; s < COLS; s++){ // s is the starting point
	int c = 0;
	int j = s;
	int i = 0;
	for(;c < 9; ++c, ++i, j+=2){
	  i = i % S1_E;
	  j = j % COLS;
	  arr[index++] = cypher[i][j];
	}
  }
  return arr;
}
```

In this case, we use dynamic memory allocation to create an array of 9×17 integers, matching the size of the first section, and return a pointer to it. The modulo `%` operator is very effective to wrap around matrices when you are iterating in weird ways and you don’t want to write extra logic using if-else constructs.

Then, we need to replace each integer in the obtained array with a character according to the substitution key. To do this, I had to do some extra manual work and translate the key using numbers instead of symbols. The result is a text file that looks like this:

```text
64
0 I
1 R
2 O
3 N
4 C
5 A
.
.
.
62 E
63 T
```

In the first line we find the number of symbols, followed by the subsitution rules. In this case it’s not necessary to use an hash-map, since we can just use a character array of 64 bytes to store the symbol table. The following is the code to read the file and build the table:

```c
char* decode(int* arr, char* convs){
  FILE *file = fopen(convs, "r");
  if (file == NULL){
	printf("Erorr in opening the file");
	return NULL;
  }
  int symbols;
  fscanf(file, "%d", &symbols);
  printf("Reading %d symbols\n", symbols);
  char *decoded = (char*)malloc(S1_E*COLS+1);
  char *symbol_table = (char*)malloc(symbols);
  for(int i =0; i<symbols; i++){
	int index;
	fscanf(file, "%d", &index);
	fscanf(file, " %c", &symbol_table[index]);
  }
  printf("Symbol table build.\n");
  for(int i = 0; i < S1_E*COLS; i++){
	decoded[i] = symbol_table[arr[i]];
  }
  decoded[S1_E*COLS] = '\0';
  free(symbol_table);
  return decoded;
}
```

I allocated one more byte for the decoded text since I want to add a ‘\\0’ at the end, effectively turning it into a C-style string. Always make sure to deallocate dynamic memory after you used it using `free`.

## Output and Conclusions

If we print the decoded string, this is what we get:

```text
IHOPEYOUAREHAVING
LOTSOFFANINTRDING
TOCATCHMETHATWASN
TMEONTHETESHOWWHI
CHBRINGOUPAPOINTA
BOUTMEIAMNOTAFRAI
DOFTHEGASCHAMBERB
ECAASEITWILLSENDM
ETOPARADLCEALLTHE
```

If we correct some errors that the killer made and we remove the last two words (it’s the beginning of the message encoded in the next section), this should be the final solution:

> I HOPE YOU ARE HAVING LOTS OF FUN IN TRYING TO CATCH ME THAT WASN’T ME ON THE TV SHOW WHICH BRINGS UP A POINT ABOUT ME I AM NOT AFRAID OF THE GAS CHAMBER BECAUSE IT WILL SEND ME TO PARADISE

We still don’t know whether the mistakes were actual errors made by the killer during encryption or clues meant to help decipher the following messages. In fact, there are other ciphers, including Z13 and Z32, which remain unsolved to this day.

In this post, I gave a short introduction to the Zodiac case, showing how the killer’s messages can be seen as puzzles that are both mysterious and macabre. They still catch the interest of codebreakers, true crime fans, and anyone curious about unsolved cases. In the next posts, we’ll take a closer look at these messages and implement some of the methods used by researchers to study and break the ciphers.

Stay tuned, and be waterproof.

Read other posts

---

[Thoughts after graduation →](/posts/grad/)
