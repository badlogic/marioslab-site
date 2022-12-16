x2$ = 0
y2$ = 4
y$1 = 8
i$2 = 12
clipped_width$ = 16
next_row$ = 20
pixel$ = 24
image$ = 48
x1$ = 56
y1$ = 64
width$ = 72
height$ = 80
color$ = 88
r96_rect PROC
$LN19:
        mov     DWORD PTR [rsp+32], r9d
        mov     DWORD PTR [rsp+24], r8d
        mov     DWORD PTR [rsp+16], edx
        mov     QWORD PTR [rsp+8], rcx
        sub     rsp, 40                             ; 00000028H
        cmp     DWORD PTR width$[rsp], 0
        jg      SHORT $LN8@r96_rect
        jmp     $LN1@r96_rect
$LN8@r96_rect:
        cmp     DWORD PTR height$[rsp], 0
        jg      SHORT $LN9@r96_rect
        jmp     $LN1@r96_rect
$LN9@r96_rect:
        mov     eax, DWORD PTR x1$[rsp]
        mov     ecx, DWORD PTR width$[rsp]
        lea     eax, DWORD PTR [rax+rcx-1]
        mov     DWORD PTR x2$[rsp], eax
        mov     eax, DWORD PTR y1$[rsp]
        mov     ecx, DWORD PTR height$[rsp]
        lea     eax, DWORD PTR [rax+rcx-1]
        mov     DWORD PTR y2$[rsp], eax
        mov     rax, QWORD PTR image$[rsp]
        mov     eax, DWORD PTR [rax]
        cmp     DWORD PTR x1$[rsp], eax
        jl      SHORT $LN10@r96_rect
        jmp     $LN1@r96_rect
$LN10@r96_rect:
        cmp     DWORD PTR x2$[rsp], 0
        jge     SHORT $LN11@r96_rect
        jmp     $LN1@r96_rect
$LN11@r96_rect:
        mov     rax, QWORD PTR image$[rsp]
        mov     eax, DWORD PTR [rax+4]
        cmp     DWORD PTR y1$[rsp], eax
        jl      SHORT $LN12@r96_rect
        jmp     $LN1@r96_rect
$LN12@r96_rect:
        cmp     DWORD PTR y2$[rsp], 0
        jge     SHORT $LN13@r96_rect
        jmp     $LN1@r96_rect
$LN13@r96_rect:
        cmp     DWORD PTR x1$[rsp], 0
        jge     SHORT $LN14@r96_rect
        mov     DWORD PTR x1$[rsp], 0
$LN14@r96_rect:
        cmp     DWORD PTR y1$[rsp], 0
        jge     SHORT $LN15@r96_rect
        mov     DWORD PTR y1$[rsp], 0
$LN15@r96_rect:
        mov     rax, QWORD PTR image$[rsp]
        mov     eax, DWORD PTR [rax]
        cmp     DWORD PTR x2$[rsp], eax
        jl      SHORT $LN16@r96_rect
        mov     rax, QWORD PTR image$[rsp]
        mov     eax, DWORD PTR [rax]
        dec     eax
        mov     DWORD PTR x2$[rsp], eax
$LN16@r96_rect:
        mov     rax, QWORD PTR image$[rsp]
        mov     eax, DWORD PTR [rax+4]
        cmp     DWORD PTR y2$[rsp], eax
        jl      SHORT $LN17@r96_rect
        mov     rax, QWORD PTR image$[rsp]
        mov     eax, DWORD PTR [rax+4]
        dec     eax
        mov     DWORD PTR y2$[rsp], eax
$LN17@r96_rect:
        mov     eax, DWORD PTR x1$[rsp]
        mov     ecx, DWORD PTR x2$[rsp]
        sub     ecx, eax
        mov     eax, ecx
        inc     eax
        mov     DWORD PTR clipped_width$[rsp], eax
        mov     rax, QWORD PTR image$[rsp]
        mov     ecx, DWORD PTR clipped_width$[rsp]
        mov     eax, DWORD PTR [rax]
        sub     eax, ecx
        mov     DWORD PTR next_row$[rsp], eax
        mov     rax, QWORD PTR image$[rsp]
        mov     ecx, DWORD PTR y1$[rsp]
        imul    ecx, DWORD PTR [rax]
        mov     eax, ecx
        cdqe
        mov     rcx, QWORD PTR image$[rsp]
        mov     rcx, QWORD PTR [rcx+8]
        lea     rax, QWORD PTR [rcx+rax*4]
        movsxd  rcx, DWORD PTR x1$[rsp]
        lea     rax, QWORD PTR [rax+rcx*4]
        mov     QWORD PTR pixel$[rsp], rax
        mov     eax, DWORD PTR y1$[rsp]
        mov     DWORD PTR y$1[rsp], eax
        jmp     SHORT $LN4@r96_rect
$LN2@r96_rect:
        mov     eax, DWORD PTR y$1[rsp]
        inc     eax
        mov     DWORD PTR y$1[rsp], eax
$LN4@r96_rect:
        mov     eax, DWORD PTR y2$[rsp]
        cmp     DWORD PTR y$1[rsp], eax
        jg      SHORT $LN3@r96_rect
        mov     DWORD PTR i$2[rsp], 0
        jmp     SHORT $LN7@r96_rect
$LN5@r96_rect:
        mov     eax, DWORD PTR i$2[rsp]
        inc     eax
        mov     DWORD PTR i$2[rsp], eax
$LN7@r96_rect:
        mov     eax, DWORD PTR clipped_width$[rsp]
        cmp     DWORD PTR i$2[rsp], eax
        jge     SHORT $LN6@r96_rect
        mov     rax, QWORD PTR pixel$[rsp]
        mov     ecx, DWORD PTR color$[rsp]
        mov     DWORD PTR [rax], ecx
        mov     rax, QWORD PTR pixel$[rsp]
        add     rax, 4
        mov     QWORD PTR pixel$[rsp], rax
        jmp     SHORT $LN5@r96_rect
$LN6@r96_rect:
        movsxd  rax, DWORD PTR next_row$[rsp]
        mov     rcx, QWORD PTR pixel$[rsp]
        lea     rax, QWORD PTR [rcx+rax*4]
        mov     QWORD PTR pixel$[rsp], rax
        jmp     SHORT $LN2@r96_rect
$LN3@r96_rect:
$LN1@r96_rect:
        add     rsp, 40                             ; 00000028H
        ret     0
r96_rect ENDP

dst_x1$ = 0
dst_y1$ = 4
dst_x2$ = 8
dst_y2$ = 12
src_y1$ = 16
src_x1$ = 20
y$1 = 24
clipped_width$ = 28
i$2 = 32
dst_pixel$ = 40
src_pixel$ = 48
dst_next_row$ = 56
src_next_row$ = 60
dst$ = 80
src$ = 88
x$ = 96
y$ = 104
blit    PROC
$LN17:
        mov     DWORD PTR [rsp+32], r9d
        mov     DWORD PTR [rsp+24], r8d
        mov     QWORD PTR [rsp+16], rdx
        mov     QWORD PTR [rsp+8], rcx
        sub     rsp, 72                             ; 00000048H
        mov     eax, DWORD PTR x$[rsp]
        mov     DWORD PTR dst_x1$[rsp], eax
        mov     eax, DWORD PTR y$[rsp]
        mov     DWORD PTR dst_y1$[rsp], eax
        mov     rax, QWORD PTR src$[rsp]
        mov     eax, DWORD PTR [rax]
        mov     ecx, DWORD PTR x$[rsp]
        lea     eax, DWORD PTR [rcx+rax-1]
        mov     DWORD PTR dst_x2$[rsp], eax
        mov     rax, QWORD PTR src$[rsp]
        mov     eax, DWORD PTR [rax+4]
        mov     ecx, DWORD PTR y$[rsp]
        lea     eax, DWORD PTR [rcx+rax-1]
        mov     DWORD PTR dst_y2$[rsp], eax
        mov     DWORD PTR src_x1$[rsp], 0
        mov     DWORD PTR src_y1$[rsp], 0
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax]
        cmp     DWORD PTR dst_x1$[rsp], eax
        jl      SHORT $LN8@blit
        jmp     $LN1@blit
$LN8@blit:
        cmp     DWORD PTR dst_x2$[rsp], 0
        jge     SHORT $LN9@blit
        jmp     $LN1@blit
$LN9@blit:
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax+4]
        cmp     DWORD PTR dst_y1$[rsp], eax
        jl      SHORT $LN10@blit
        jmp     $LN1@blit
$LN10@blit:
        cmp     DWORD PTR dst_y2$[rsp], 0
        jge     SHORT $LN11@blit
        jmp     $LN1@blit
$LN11@blit:
        cmp     DWORD PTR dst_x1$[rsp], 0
        jge     SHORT $LN12@blit
        mov     eax, DWORD PTR dst_x1$[rsp]
        mov     ecx, DWORD PTR src_x1$[rsp]
        sub     ecx, eax
        mov     eax, ecx
        mov     DWORD PTR src_x1$[rsp], eax
        mov     DWORD PTR dst_x1$[rsp], 0
$LN12@blit:
        cmp     DWORD PTR dst_y1$[rsp], 0
        jge     SHORT $LN13@blit
        mov     eax, DWORD PTR dst_y1$[rsp]
        mov     ecx, DWORD PTR src_y1$[rsp]
        sub     ecx, eax
        mov     eax, ecx
        mov     DWORD PTR src_y1$[rsp], eax
        mov     DWORD PTR dst_y1$[rsp], 0
$LN13@blit:
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax]
        cmp     DWORD PTR dst_x2$[rsp], eax
        jl      SHORT $LN14@blit
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax]
        dec     eax
        mov     DWORD PTR dst_x2$[rsp], eax
$LN14@blit:
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax+4]
        cmp     DWORD PTR dst_y2$[rsp], eax
        jl      SHORT $LN15@blit
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax+4]
        dec     eax
        mov     DWORD PTR dst_y2$[rsp], eax
$LN15@blit:
        mov     eax, DWORD PTR dst_x1$[rsp]
        mov     ecx, DWORD PTR dst_x2$[rsp]
        sub     ecx, eax
        mov     eax, ecx
        inc     eax
        mov     DWORD PTR clipped_width$[rsp], eax
        mov     rax, QWORD PTR dst$[rsp]
        mov     ecx, DWORD PTR clipped_width$[rsp]
        mov     eax, DWORD PTR [rax]
        sub     eax, ecx
        mov     DWORD PTR dst_next_row$[rsp], eax
        mov     rax, QWORD PTR src$[rsp]
        mov     ecx, DWORD PTR clipped_width$[rsp]
        mov     eax, DWORD PTR [rax]
        sub     eax, ecx
        mov     DWORD PTR src_next_row$[rsp], eax
        mov     rax, QWORD PTR dst$[rsp]
        mov     ecx, DWORD PTR dst_y1$[rsp]
        imul    ecx, DWORD PTR [rax]
        mov     eax, ecx
        cdqe
        mov     rcx, QWORD PTR dst$[rsp]
        mov     rcx, QWORD PTR [rcx+8]
        lea     rax, QWORD PTR [rcx+rax*4]
        movsxd  rcx, DWORD PTR dst_x1$[rsp]
        lea     rax, QWORD PTR [rax+rcx*4]
        mov     QWORD PTR dst_pixel$[rsp], rax
        mov     rax, QWORD PTR src$[rsp]
        mov     ecx, DWORD PTR src_y1$[rsp]
        imul    ecx, DWORD PTR [rax]
        mov     eax, ecx
        cdqe
        mov     rcx, QWORD PTR src$[rsp]
        mov     rcx, QWORD PTR [rcx+8]
        lea     rax, QWORD PTR [rcx+rax*4]
        movsxd  rcx, DWORD PTR src_x1$[rsp]
        lea     rax, QWORD PTR [rax+rcx*4]
        mov     QWORD PTR src_pixel$[rsp], rax
        mov     eax, DWORD PTR dst_y1$[rsp]
        mov     DWORD PTR y$1[rsp], eax
        jmp     SHORT $LN4@blit
$LN2@blit:
        mov     eax, DWORD PTR y$1[rsp]
        inc     eax
        mov     DWORD PTR y$1[rsp], eax
$LN4@blit:
        mov     eax, DWORD PTR dst_y2$[rsp]
        cmp     DWORD PTR y$1[rsp], eax
        jg      SHORT $LN3@blit
        mov     DWORD PTR i$2[rsp], 0
        jmp     SHORT $LN7@blit
$LN5@blit:
        mov     eax, DWORD PTR i$2[rsp]
        inc     eax
        mov     DWORD PTR i$2[rsp], eax
$LN7@blit:
        mov     eax, DWORD PTR clipped_width$[rsp]
        cmp     DWORD PTR i$2[rsp], eax
        jge     SHORT $LN6@blit
        mov     rax, QWORD PTR dst_pixel$[rsp]
        mov     rcx, QWORD PTR src_pixel$[rsp]
        mov     ecx, DWORD PTR [rcx]
        mov     DWORD PTR [rax], ecx
        mov     rax, QWORD PTR dst_pixel$[rsp]
        add     rax, 4
        mov     QWORD PTR dst_pixel$[rsp], rax
        mov     rax, QWORD PTR src_pixel$[rsp]
        add     rax, 4
        mov     QWORD PTR src_pixel$[rsp], rax
        jmp     SHORT $LN5@blit
$LN6@blit:
        movsxd  rax, DWORD PTR dst_next_row$[rsp]
        mov     rcx, QWORD PTR dst_pixel$[rsp]
        lea     rax, QWORD PTR [rcx+rax*4]
        mov     QWORD PTR dst_pixel$[rsp], rax
        movsxd  rax, DWORD PTR src_next_row$[rsp]
        mov     rcx, QWORD PTR src_pixel$[rsp]
        lea     rax, QWORD PTR [rcx+rax*4]
        mov     QWORD PTR src_pixel$[rsp], rax
        jmp     $LN2@blit
$LN3@blit:
$LN1@blit:
        add     rsp, 72                             ; 00000048H
        ret     0
blit    ENDP

dst_x1$ = 0
dst_y1$ = 4
dst_x2$ = 8
dst_y2$ = 12
src_y1$ = 16
src_x1$ = 20
y$1 = 24
clipped_width$ = 28
i$2 = 32
color$3 = 36
dst_pixel$ = 40
src_pixel$ = 48
dst_next_row$ = 56
src_next_row$ = 60
dst$ = 80
src$ = 88
x$ = 96
y$ = 104
color_key$ = 112
blit_keyed_opt2 PROC
$LN18:
        mov     DWORD PTR [rsp+32], r9d
        mov     DWORD PTR [rsp+24], r8d
        mov     QWORD PTR [rsp+16], rdx
        mov     QWORD PTR [rsp+8], rcx
        sub     rsp, 72                             ; 00000048H
        mov     eax, DWORD PTR x$[rsp]
        mov     DWORD PTR dst_x1$[rsp], eax
        mov     eax, DWORD PTR y$[rsp]
        mov     DWORD PTR dst_y1$[rsp], eax
        mov     rax, QWORD PTR src$[rsp]
        mov     eax, DWORD PTR [rax]
        mov     ecx, DWORD PTR x$[rsp]
        lea     eax, DWORD PTR [rcx+rax-1]
        mov     DWORD PTR dst_x2$[rsp], eax
        mov     rax, QWORD PTR src$[rsp]
        mov     eax, DWORD PTR [rax+4]
        mov     ecx, DWORD PTR y$[rsp]
        lea     eax, DWORD PTR [rcx+rax-1]
        mov     DWORD PTR dst_y2$[rsp], eax
        mov     DWORD PTR src_x1$[rsp], 0
        mov     DWORD PTR src_y1$[rsp], 0
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax]
        cmp     DWORD PTR dst_x1$[rsp], eax
        jl      SHORT $LN8@blit_keyed
        jmp     $LN1@blit_keyed
$LN8@blit_keyed:
        cmp     DWORD PTR dst_x2$[rsp], 0
        jge     SHORT $LN9@blit_keyed
        jmp     $LN1@blit_keyed
$LN9@blit_keyed:
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax+4]
        cmp     DWORD PTR dst_y1$[rsp], eax
        jl      SHORT $LN10@blit_keyed
        jmp     $LN1@blit_keyed
$LN10@blit_keyed:
        cmp     DWORD PTR dst_y2$[rsp], 0
        jge     SHORT $LN11@blit_keyed
        jmp     $LN1@blit_keyed
$LN11@blit_keyed:
        cmp     DWORD PTR dst_x1$[rsp], 0
        jge     SHORT $LN12@blit_keyed
        mov     eax, DWORD PTR dst_x1$[rsp]
        mov     ecx, DWORD PTR src_x1$[rsp]
        sub     ecx, eax
        mov     eax, ecx
        mov     DWORD PTR src_x1$[rsp], eax
        mov     DWORD PTR dst_x1$[rsp], 0
$LN12@blit_keyed:
        cmp     DWORD PTR dst_y1$[rsp], 0
        jge     SHORT $LN13@blit_keyed
        mov     eax, DWORD PTR dst_y1$[rsp]
        mov     ecx, DWORD PTR src_y1$[rsp]
        sub     ecx, eax
        mov     eax, ecx
        mov     DWORD PTR src_y1$[rsp], eax
        mov     DWORD PTR dst_y1$[rsp], 0
$LN13@blit_keyed:
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax]
        cmp     DWORD PTR dst_x2$[rsp], eax
        jl      SHORT $LN14@blit_keyed
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax]
        dec     eax
        mov     DWORD PTR dst_x2$[rsp], eax
$LN14@blit_keyed:
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax+4]
        cmp     DWORD PTR dst_y2$[rsp], eax
        jl      SHORT $LN15@blit_keyed
        mov     rax, QWORD PTR dst$[rsp]
        mov     eax, DWORD PTR [rax+4]
        dec     eax
        mov     DWORD PTR dst_y2$[rsp], eax
$LN15@blit_keyed:
        mov     eax, DWORD PTR dst_x1$[rsp]
        mov     ecx, DWORD PTR dst_x2$[rsp]
        sub     ecx, eax
        mov     eax, ecx
        inc     eax
        mov     DWORD PTR clipped_width$[rsp], eax
        mov     rax, QWORD PTR dst$[rsp]
        mov     ecx, DWORD PTR clipped_width$[rsp]
        mov     eax, DWORD PTR [rax]
        sub     eax, ecx
        mov     DWORD PTR dst_next_row$[rsp], eax
        mov     rax, QWORD PTR src$[rsp]
        mov     ecx, DWORD PTR clipped_width$[rsp]
        mov     eax, DWORD PTR [rax]
        sub     eax, ecx
        mov     DWORD PTR src_next_row$[rsp], eax
        mov     rax, QWORD PTR dst$[rsp]
        mov     ecx, DWORD PTR dst_y1$[rsp]
        imul    ecx, DWORD PTR [rax]
        mov     eax, ecx
        cdqe
        mov     rcx, QWORD PTR dst$[rsp]
        mov     rcx, QWORD PTR [rcx+8]
        lea     rax, QWORD PTR [rcx+rax*4]
        movsxd  rcx, DWORD PTR dst_x1$[rsp]
        lea     rax, QWORD PTR [rax+rcx*4]
        mov     QWORD PTR dst_pixel$[rsp], rax
        mov     rax, QWORD PTR src$[rsp]
        mov     ecx, DWORD PTR src_y1$[rsp]
        imul    ecx, DWORD PTR [rax]
        mov     eax, ecx
        cdqe
        mov     rcx, QWORD PTR src$[rsp]
        mov     rcx, QWORD PTR [rcx+8]
        lea     rax, QWORD PTR [rcx+rax*4]
        movsxd  rcx, DWORD PTR src_x1$[rsp]
        lea     rax, QWORD PTR [rax+rcx*4]
        mov     QWORD PTR src_pixel$[rsp], rax
        mov     eax, DWORD PTR dst_y1$[rsp]
        mov     DWORD PTR y$1[rsp], eax
        jmp     SHORT $LN4@blit_keyed
$LN2@blit_keyed:
        mov     eax, DWORD PTR y$1[rsp]
        inc     eax
        mov     DWORD PTR y$1[rsp], eax
$LN4@blit_keyed:
        mov     eax, DWORD PTR dst_y2$[rsp]
        cmp     DWORD PTR y$1[rsp], eax
        jg      $LN3@blit_keyed
        mov     DWORD PTR i$2[rsp], 0
        jmp     SHORT $LN7@blit_keyed
$LN5@blit_keyed:
        mov     eax, DWORD PTR i$2[rsp]
        inc     eax
        mov     DWORD PTR i$2[rsp], eax
$LN7@blit_keyed:
        mov     eax, DWORD PTR clipped_width$[rsp]
        cmp     DWORD PTR i$2[rsp], eax
        jge     SHORT $LN6@blit_keyed
        mov     rax, QWORD PTR src_pixel$[rsp]
        mov     eax, DWORD PTR [rax]
        mov     DWORD PTR color$3[rsp], eax
        mov     eax, DWORD PTR color_key$[rsp]
        cmp     DWORD PTR color$3[rsp], eax
        je      SHORT $LN16@blit_keyed
        mov     rax, QWORD PTR dst_pixel$[rsp]
        mov     ecx, DWORD PTR color$3[rsp]
        mov     DWORD PTR [rax], ecx
$LN16@blit_keyed:
        mov     rax, QWORD PTR src_pixel$[rsp]
        add     rax, 4
        mov     QWORD PTR src_pixel$[rsp], rax
        mov     rax, QWORD PTR dst_pixel$[rsp]
        add     rax, 4
        mov     QWORD PTR dst_pixel$[rsp], rax
        jmp     SHORT $LN5@blit_keyed
$LN6@blit_keyed:
        movsxd  rax, DWORD PTR dst_next_row$[rsp]
        mov     rcx, QWORD PTR dst_pixel$[rsp]
        lea     rax, QWORD PTR [rcx+rax*4]
        mov     QWORD PTR dst_pixel$[rsp], rax
        movsxd  rax, DWORD PTR src_next_row$[rsp]
        mov     rcx, QWORD PTR src_pixel$[rsp]
        lea     rax, QWORD PTR [rcx+rax*4]
        mov     QWORD PTR src_pixel$[rsp], rax
        jmp     $LN2@blit_keyed
$LN3@blit_keyed:
$LN1@blit_keyed:
        add     rsp, 72                             ; 00000048H
        ret     0
blit_keyed_opt2 ENDP

main    PROC
$LN3:
        sub     rsp, 56                             ; 00000038H
        mov     DWORD PTR [rsp+40], 0
        mov     DWORD PTR [rsp+32], 10
        mov     r9d, 10
        xor     r8d, r8d
        xor     edx, edx
        xor     ecx, ecx
        call    r96_rect
        xor     r9d, r9d
        xor     r8d, r8d
        xor     edx, edx
        xor     ecx, ecx
        call    blit
        mov     DWORD PTR [rsp+32], 0
        xor     r9d, r9d
        xor     r8d, r8d
        xor     edx, edx
        xor     ecx, ecx
        call    blit_keyed_opt2
        xor     eax, eax
        add     rsp, 56                             ; 00000038H
        ret     0
main    ENDP