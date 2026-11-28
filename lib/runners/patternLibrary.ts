/**
 * Shared Input-Reading Pattern Library for Tier 1 & Tier 2 Languages
 * Generates accurate competitive-programming stdin/stdout boilerplate
 * based on input formats (numbers, strings, arrays, matrices).
 */

export type InputPattern =
  | "single_integer"
  | "single_string"
  | "two_strings"
  | "array_with_target"
  | "integer_and_array"
  | "two_arrays"
  | "matrix_2d"
  | "generic_tokens";

export interface LanguagePatternBoilerplate {
  setup: string;
  readTokens: string;
  solveSkeleton: string;
  closing: string;
}

export const TIER2_STARTER_TEMPLATES: Record<string, (problemTitle?: string, pattern?: InputPattern) => string> = {
  // Go (1.23.5)
  go: (title = "Solution") => `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func solve() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)

	var tokens []string
	for scanner.Scan() {
		tokens = append(tokens, scanner.Text())
	}
	if len(tokens) == 0 {
		return
	}

	// Solve problem: ${title}
	// Print output using fmt.Println(...)
}

func main() {
	solve()
}
`,

  // Rust (1.85.0)
  rust: (title = "Solution") => `use std::io::{self, Read};

fn solve() {
    let mut buffer = String::new();
    io::stdin().read_to_string(&mut buffer).unwrap();
    let mut tokens = buffer.split_whitespace();

    // Read tokens and solve: ${title}
    // println!("{}", result);
}

fn main() {
    solve();
}
`,

  // C# (Mono 6.6)
  csharp: (title = "Solution") => `using System;
using System.Collections.Generic;

class Solution {
    static void Main(string[] args) {
        string input = Console.In.ReadToEnd();
        if (string.IsNullOrWhiteSpace(input)) return;
        
        string[] tokens = input.Split(new[] { ' ', '\\t', '\\n', '\\r' }, StringSplitOptions.RemoveEmptyEntries);
        // Solve problem: ${title}
        // Console.WriteLine(result);
    }
}
`,

  // Kotlin (2.1.10)
  kotlin: (title = "Solution") => `import java.util.Scanner

fun main() {
    val scanner = Scanner(System.\`in\`)
    if (!scanner.hasNext()) return

    // Read input and solve: ${title}
    // println(result)
}
`,

  // Swift (5.2.3)
  swift: (title = "Solution") => `import Foundation

func solve() {
    let input = FileHandle.standardInput.readDataToEndOfFile()
    guard let str = String(data: input, encoding: .utf8) else { return }
    let tokens = str.split { $0.isWhitespace }.map(String.init)
    if tokens.isEmpty { return }

    // Solve problem: ${title}
    // print(result)
}

solve()
`,

  // Ruby (2.7.0)
  ruby: (title = "Solution") => `def solve
  tokens = STDIN.read.split
  return if tokens.empty?

  # Solve problem: ${title}
  # puts result
end

solve
`,

  // PHP (8.3.11)
  php: (title = "Solution") => `<?php
function solve() {
    $input = file_get_contents("php://stdin");
    $tokens = preg_split('/\\s+/', trim($input));
    if (empty($tokens) || $tokens[0] === "") return;

    // Solve problem: ${title}
    // echo $result . "\\n";
}

solve();
`,

  // Scala (3.4.2)
  scala: (title = "Solution") => `import java.util.Scanner

@main def run() =
  val scanner = new Scanner(System.in)
  if scanner.hasNext() then
    // Solve problem: ${title}
    // println(result)
    ()
`,

  // R (4.4.1)
  r: (title = "Solution") => `f <- file("stdin")
open(f)
lines <- readLines(f, warn = FALSE)
tokens <- unlist(strsplit(lines, "\\s+"))
tokens <- tokens[tokens != ""]

# Solve problem: ${title}
# cat(result, "\n")
`,

  // Dart (2.19.2)
  dart: (title = "Solution") => `import 'dart:io';

void main() {
  final input = stdin.readLineSync();
  if (input == null) return;
  final tokens = input.trim().split(RegExp(r'\\s+'));

  // Solve problem: ${title}
  // print(result);
}
`,

  // Perl (5.28.1)
  perl: (title = "Solution") => `use strict;
use warnings;

my $input = do { local $/; <STDIN> };
my @tokens = split(/\\s+/, $input);

# Solve problem: ${title}
# print "$result\\n";
`,

  // Lua (5.3.5)
  lua: (title = "Solution") => `local function solve()
    local tokens = {}
    for word in io.read("*a"):gmatch("%S+") do
        table.insert(tokens, word)
    end
    if #tokens == 0 then return end

    -- Solve problem: ${title}
    -- print(result)
end

solve()
`,

  // Haskell (GHC 8.8.1)
  haskell: (title = "Solution") => `module Main where

import System.IO

solve :: String -> String
solve input = 
    let tokens = words input
    in "Solution"

main :: IO ()
main = do
    contents <- getContents
    putStrLn (solve contents)
`,
};

export const TIER3_GENERIC_SKELETONS: Record<string, (problemTitle?: string) => string> = {
  elixir: (title = "Solution") => `defmodule Solution do
  def run do
    input = IO.read(:stdio, :all) |> String.split()
    # Solve problem: ${title}
    # IO.puts(result)
  end
end

Solution.run()
`,

  erlang: (title = "Solution") => `-module(main).
-export([start/0]).

start() ->
    case io:fread("", "~s") of
        {ok, [First]} ->
            % Solve: ${title}
            io:format("~s~n", [First]);
        _ -> ok
    end.
`,

  clojure: (title = "Solution") => `(ns solution
  (:require [clojure.string :as str]))

(defn -main [& args]
  (let [tokens (str/split (slurp *in*) #"\\s+")]
    ; Solve: ${title}
    (println (first tokens))))
`,

  fsharp: (title = "Solution") => `open System

[<EntryPoint>]
let main argv =
    let input = Console.In.ReadToEnd()
    let tokens = input.Split([|' '; '\\t'; '\\n'; '\\r'|], StringSplitOptions.RemoveEmptyEntries)
    // Solve: ${title}
    0
`,

  groovy: (title = "Solution") => `def tokens = System.in.text.tokenize()
// Solve: ${title}
// println(result)
`,

  d: (title = "Solution") => `import std.stdio;
import std.array;

void main() {
    // Solve: ${title}
    // writeln(result);
}
`,

  fortran: (title = "Solution") => `program solution
    implicit none
    ! Solve: ${title}
    print *, "Output"
end program solution
`,

  cobol: (title = "Solution") => `       IDENTIFICATION DIVISION.
       PROGRAM-ID. SOLUTION.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 STR-IN PIC X(100).
       PROCEDURE DIVISION.
           ACCEPT STR-IN.
           DISPLAY STR-IN.
           STOP RUN.
`,

  pascal: (title = "Solution") => `program Solution;
var
  s: string;
begin
  if not eof then
  begin
    readln(s);
    writeln(s);
  end;
end.
`,

  bash: (title = "Solution") => `#!/usr/bin/env bash
read -r line
# Solve: ${title}
echo "$line"
`,

  basic: (title = "Solution") => `DIM s AS STRING
LINE INPUT s
PRINT s
`,

  ocaml: (title = "Solution") => `let () =
  let line = read_line () in
  (* Solve: ${title} *)
  print_endline line
`,

  octave: (title = "Solution") => `% Solve: ${title}
line = fgetl(stdin);
disp(line);
`,

  prolog: (title = "Solution") => `initialization(main).
main :-
    read_line_to_string(user_input, S),
    write(S), nl,
    halt.
`,

  commonlisp: (title = "Solution") => `(let ((line (read-line nil nil)))
  (if line
      (format t "~A~%" line)))
`,

  vbnet: (title = "Solution") => `Imports System

Module Program
    Sub Main()
        Dim line As String = Console.ReadLine()
        Console.WriteLine(line)
    End Sub
End Module
`,

  objectivec: (title = "Solution") => `#import <Foundation/Foundation.h>

int main() {
    @autoreleasepool {
        char buf[1024];
        if (fgets(buf, sizeof(buf), stdin)) {
            printf("%s", buf);
        }
    }
    return 0;
}
`,

  assembly: (title = "Solution") => `section .data
    msg db "Output", 10
    len equ $ - msg
section .text
    global _start
_start:
    mov eax, 4
    mov ebx, 1
    mov ecx, msg
    mov edx, len
    int 0x80
    mov eax, 1
    xor ebx, ebx
    int 0x80
`,
};
