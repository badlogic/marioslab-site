r96_rect:                               # @r96_rect
        push    rbp
        push    r15
        push    r14
        push    r13
        push    r12
        push    rbx
        test    ecx, ecx
        jle     .LBB0_22
        test    r8d, r8d
        jle     .LBB0_22
        mov     ebp, dword ptr [rdi]
        cmp     ebp, esi
        jle     .LBB0_22
        add     ecx, esi
        test    ecx, ecx
        jle     .LBB0_22
        mov     r10d, dword ptr [rdi + 4]
        cmp     r10d, edx
        jle     .LBB0_22
        add     r8d, edx
        test    r8d, r8d
        jle     .LBB0_22
        xor     eax, eax
        test    esi, esi
        cmovle  esi, eax
        test    edx, edx
        cmovg   eax, edx
        cmp     ecx, ebp
        cmovge  ecx, ebp
        cmp     r8d, r10d
        cmovl   r10d, r8d
        cmp     eax, r10d
        jge     .LBB0_22
        mov     r12d, esi
        not     r12d
        add     r12d, ecx
        js      .LBB0_22
        lea     edx, [rsi + rbp]
        sub     edx, ecx
        imul    ebp, eax
        movsxd  rbp, ebp
        shl     rbp, 2
        add     rbp, qword ptr [rdi + 8]
        movsxd  r8, edx
        mov     edx, esi
        lea     rdi, [4*rdx]
        add     rdi, rbp
        mov     r11d, r12d
        inc     r11
        mov     rbx, r11
        and     rbx, -8
        lea     r14, [rbx - 8]
        mov     rdx, r14
        shr     rdx, 3
        inc     rdx
        lea     rbp, [4*rbx]
        mov     qword ptr [rsp - 8], rbp        # 8-byte Spill
        movd    xmm0, r9d
        pshufd  xmm0, xmm0, 0                   # xmm0 = xmm0[0,0,0,0]
        mov     r13d, edx
        and     r13d, 3
        and     rdx, -4
        mov     qword ptr [rsp - 16], rdx       # 8-byte Spill
        mov     rbp, r13
        shl     rbp, 5
        sub     esi, ecx
        jmp     .LBB0_9
.LBB0_21:                               #   in Loop: Header=BB0_9 Depth=1
        lea     rdi, [rdi + 4*r8]
        inc     eax
        cmp     eax, r10d
        je      .LBB0_22
.LBB0_9:                                # =>This Loop Header: Depth=1
        cmp     r12d, 7
        jae     .LBB0_11
        xor     ecx, ecx
        jmp     .LBB0_19
.LBB0_11:                               #   in Loop: Header=BB0_9 Depth=1
        cmp     r14, 24
        jae     .LBB0_13
        xor     ecx, ecx
        jmp     .LBB0_15
.LBB0_13:                               #   in Loop: Header=BB0_9 Depth=1
        mov     r15, qword ptr [rsp - 16]       # 8-byte Reload
        xor     ecx, ecx
.LBB0_14:                               #   Parent Loop BB0_9 Depth=1
        movdqu  xmmword ptr [rdi + 4*rcx], xmm0
        movdqu  xmmword ptr [rdi + 4*rcx + 16], xmm0
        movdqu  xmmword ptr [rdi + 4*rcx + 32], xmm0
        movdqu  xmmword ptr [rdi + 4*rcx + 48], xmm0
        movdqu  xmmword ptr [rdi + 4*rcx + 64], xmm0
        movdqu  xmmword ptr [rdi + 4*rcx + 80], xmm0
        movdqu  xmmword ptr [rdi + 4*rcx + 96], xmm0
        movdqu  xmmword ptr [rdi + 4*rcx + 112], xmm0
        add     rcx, 32
        add     r15, -4
        jne     .LBB0_14
.LBB0_15:                               #   in Loop: Header=BB0_9 Depth=1
        test    r13, r13
        je      .LBB0_18
        lea     rcx, [rdi + 4*rcx]
        add     rcx, 16
        xor     edx, edx
.LBB0_17:                               #   Parent Loop BB0_9 Depth=1
        movdqu  xmmword ptr [rcx + rdx - 16], xmm0
        movdqu  xmmword ptr [rcx + rdx], xmm0
        add     rdx, 32
        cmp     rbp, rdx
        jne     .LBB0_17
.LBB0_18:                               #   in Loop: Header=BB0_9 Depth=1
        add     rdi, qword ptr [rsp - 8]        # 8-byte Folded Reload
        mov     ecx, ebx
        cmp     r11, rbx
        je      .LBB0_21
.LBB0_19:                               #   in Loop: Header=BB0_9 Depth=1
        add     ecx, esi
.LBB0_20:                               #   Parent Loop BB0_9 Depth=1
        mov     dword ptr [rdi], r9d
        add     rdi, 4
        inc     ecx
        jne     .LBB0_20
        jmp     .LBB0_21
.LBB0_22:
        pop     rbx
        pop     r12
        pop     r13
        pop     r14
        pop     r15
        pop     rbp
        ret
blit:                                   # @blit
        push    rbp
        push    r15
        push    r14
        push    r13
        push    r12
        push    rbx
        mov     r12d, dword ptr [rdi]
        cmp     r12d, edx
        jle     .LBB1_27
        mov     r11d, dword ptr [rsi]
        lea     r8d, [r11 + rdx]
        test    r8d, r8d
        jle     .LBB1_27
        mov     r10d, dword ptr [rdi + 4]
        cmp     r10d, ecx
        jle     .LBB1_27
        mov     ebx, dword ptr [rsi + 4]
        add     ebx, ecx
        test    ebx, ebx
        jle     .LBB1_27
        xor     r9d, r9d
        test    ecx, ecx
        mov     eax, 0
        cmovg   eax, ecx
        cmp     ebx, r10d
        cmovl   r10d, ebx
        cmp     eax, r10d
        jge     .LBB1_27
        cmp     r8d, r12d
        cmovge  r8d, r12d
        test    edx, edx
        cmovg   r9d, edx
        mov     r13d, r9d
        not     r13d
        add     r13d, r8d
        js      .LBB1_27
        mov     ebx, r8d
        sub     ebx, r9d
        mov     r14d, r11d
        sub     r14d, ebx
        mov     ebp, r12d
        mov     dword ptr [rsp - 44], ebx       # 4-byte Spill
        sub     ebp, ebx
        movsxd  rbx, ebp
        mov     qword ptr [rsp - 8], rbx        # 8-byte Spill
        movsxd  r14, r14d
        imul    r12d, eax
        movsxd  rbx, r12d
        shl     rbx, 2
        add     rbx, qword ptr [rdi + 8]
        mov     edi, r9d
        lea     rdi, [rbx + 4*rdi]
        mov     ebx, ecx
        neg     ebx
        sar     ecx, 31
        and     ecx, ebx
        imul    ecx, r11d
        movsxd  rcx, ecx
        shl     rcx, 2
        add     rcx, qword ptr [rsi + 8]
        mov     esi, edx
        neg     esi
        sar     edx, 31
        and     edx, esi
        movsxd  rdx, edx
        lea     rcx, [rcx + 4*rdx]
        mov     r12d, r13d
        inc     r12
        mov     qword ptr [rsp - 16], r12       # 8-byte Spill
        and     r12, -8
        lea     rdx, [r12 - 8]
        mov     qword ptr [rsp - 24], rdx       # 8-byte Spill
        mov     rsi, rdx
        shr     rsi, 3
        inc     rsi
        lea     r15, [4*r12]
        mov     rdx, rsi
        mov     qword ptr [rsp - 32], rsi       # 8-byte Spill
        and     rsi, -2
        mov     qword ptr [rsp - 40], rsi       # 8-byte Spill
        jmp     .LBB1_8
.LBB1_7:                                #   in Loop: Header=BB1_8 Depth=1
        mov     rdx, qword ptr [rsp - 8]        # 8-byte Reload
        lea     rdi, [rdi + 4*rdx]
        lea     rcx, [rcx + 4*r14]
        inc     eax
        cmp     eax, r10d
        je      .LBB1_27
.LBB1_8:                                # =>This Loop Header: Depth=1
        cmp     r13d, 7
        jb      .LBB1_17
        mov     rsi, rdi
        sub     rsi, rcx
        cmp     rsi, 32
        jb      .LBB1_17
        cmp     qword ptr [rsp - 24], 0         # 8-byte Folded Reload
        je      .LBB1_26
        mov     rbp, qword ptr [rsp - 40]       # 8-byte Reload
        xor     esi, esi
.LBB1_12:                               #   Parent Loop BB1_8 Depth=1
        movups  xmm0, xmmword ptr [rcx + 4*rsi]
        movups  xmm1, xmmword ptr [rcx + 4*rsi + 16]
        movups  xmmword ptr [rdi + 4*rsi], xmm0
        movups  xmmword ptr [rdi + 4*rsi + 16], xmm1
        movups  xmm0, xmmword ptr [rcx + 4*rsi + 32]
        movups  xmm1, xmmword ptr [rcx + 4*rsi + 48]
        movups  xmmword ptr [rdi + 4*rsi + 32], xmm0
        movups  xmmword ptr [rdi + 4*rsi + 48], xmm1
        add     rsi, 16
        add     rbp, -2
        jne     .LBB1_12
        test    byte ptr [rsp - 32], 1          # 1-byte Folded Reload
        je      .LBB1_15
.LBB1_14:                               #   in Loop: Header=BB1_8 Depth=1
        movups  xmm0, xmmword ptr [rcx + 4*rsi]
        movups  xmm1, xmmword ptr [rcx + 4*rsi + 16]
        movups  xmmword ptr [rdi + 4*rsi], xmm0
        movups  xmmword ptr [rdi + 4*rsi + 16], xmm1
.LBB1_15:                               #   in Loop: Header=BB1_8 Depth=1
        add     rcx, r15
        add     rdi, r15
        mov     esi, r12d
        cmp     qword ptr [rsp - 16], r12       # 8-byte Folded Reload
        je      .LBB1_7
        jmp     .LBB1_18
.LBB1_17:                               #   in Loop: Header=BB1_8 Depth=1
        xor     esi, esi
.LBB1_18:                               #   in Loop: Header=BB1_8 Depth=1
        mov     ebp, r8d
        sub     ebp, r9d
        sub     ebp, esi
        mov     r11d, r13d
        sub     r11d, esi
        and     ebp, 7
        je      .LBB1_22
        mov     rdx, r9
        neg     ebp
        xor     ebx, ebx
.LBB1_20:                               #   Parent Loop BB1_8 Depth=1
        mov     r9d, dword ptr [rcx]
        add     rcx, 4
        mov     dword ptr [rdi], r9d
        add     rdi, 4
        dec     ebx
        cmp     ebp, ebx
        jne     .LBB1_20
        sub     esi, ebx
        mov     r9, rdx
.LBB1_22:                               #   in Loop: Header=BB1_8 Depth=1
        cmp     r11d, 7
        jb      .LBB1_7
        mov     edx, dword ptr [rsp - 44]       # 4-byte Reload
        mov     ebp, edx
        sub     ebp, esi
        xor     esi, esi
        xor     ebx, ebx
.LBB1_24:                               #   Parent Loop BB1_8 Depth=1
        mov     edx, dword ptr [rcx + 4*rbx]
        mov     dword ptr [rdi + 4*rbx], edx
        mov     edx, dword ptr [rcx + 4*rbx + 4]
        mov     dword ptr [rdi + 4*rbx + 4], edx
        mov     edx, dword ptr [rcx + 4*rbx + 8]
        mov     dword ptr [rdi + 4*rbx + 8], edx
        mov     edx, dword ptr [rcx + 4*rbx + 12]
        mov     dword ptr [rdi + 4*rbx + 12], edx
        mov     edx, dword ptr [rcx + 4*rbx + 16]
        mov     dword ptr [rdi + 4*rbx + 16], edx
        mov     edx, dword ptr [rcx + 4*rbx + 20]
        mov     dword ptr [rdi + 4*rbx + 20], edx
        mov     edx, dword ptr [rcx + 4*rbx + 24]
        mov     dword ptr [rdi + 4*rbx + 24], edx
        mov     edx, dword ptr [rcx + 4*rbx + 28]
        mov     dword ptr [rdi + 4*rbx + 28], edx
        add     rbx, 8
        add     rsi, -32
        cmp     ebp, ebx
        jne     .LBB1_24
        sub     rcx, rsi
        sub     rdi, rsi
        jmp     .LBB1_7
.LBB1_26:                               #   in Loop: Header=BB1_8 Depth=1
        xor     esi, esi
        test    byte ptr [rsp - 32], 1          # 1-byte Folded Reload
        jne     .LBB1_14
        jmp     .LBB1_15
.LBB1_27:
        pop     rbx
        pop     r12
        pop     r13
        pop     r14
        pop     r15
        pop     rbp
        ret
blit_keyed_opt2:                        # @blit_keyed_opt2
        push    rbp
        push    r15
        push    r14
        push    r13
        push    r12
        push    rbx
        mov     ebx, dword ptr [rdi]
        cmp     ebx, edx
        jle     .LBB2_48
        mov     r10d, dword ptr [rsi]
        lea     r9d, [r10 + rdx]
        test    r9d, r9d
        jle     .LBB2_48
        mov     r11d, dword ptr [rdi + 4]
        cmp     r11d, ecx
        jle     .LBB2_48
        mov     eax, dword ptr [rsi + 4]
        add     eax, ecx
        test    eax, eax
        jle     .LBB2_48
        test    ecx, ecx
        mov     r13d, 0
        cmovg   r13d, ecx
        cmp     eax, r11d
        cmovl   r11d, eax
        cmp     r13d, r11d
        jge     .LBB2_48
        cmp     r9d, ebx
        cmovge  r9d, ebx
        test    edx, edx
        mov     eax, 0
        cmovg   eax, edx
        mov     qword ptr [rsp - 32], rax       # 8-byte Spill
        mov     r15d, eax
        not     r15d
        add     r15d, r9d
        js      .LBB2_48
        mov     eax, r9d
        mov     r14, qword ptr [rsp - 32]       # 8-byte Reload
        sub     eax, r14d
        mov     r12d, r10d
        sub     r12d, eax
        mov     ebp, ebx
        mov     dword ptr [rsp - 36], eax       # 4-byte Spill
        sub     ebp, eax
        movsxd  rax, ebp
        mov     qword ptr [rsp - 8], rax        # 8-byte Spill
        movsxd  rax, r12d
        mov     qword ptr [rsp - 16], rax       # 8-byte Spill
        imul    ebx, r13d
        movsxd  rax, ebx
        shl     rax, 2
        add     rax, qword ptr [rdi + 8]
        mov     edi, r14d
        lea     rbp, [rax + 4*rdi]
        mov     eax, ecx
        neg     eax
        sar     ecx, 31
        and     ecx, eax
        imul    ecx, r10d
        movsxd  rax, ecx
        shl     rax, 2
        add     rax, qword ptr [rsi + 8]
        mov     ecx, edx
        neg     ecx
        sar     edx, 31
        and     edx, ecx
        movsxd  rcx, edx
        lea     r14, [rax + 4*rcx]
        mov     edx, r15d
        inc     rdx
        mov     qword ptr [rsp - 24], rdx       # 8-byte Spill
        and     rdx, -8
        lea     r10, [4*rdx]
        movd    xmm0, r8d
        pshufd  xmm0, xmm0, 0                   # xmm0 = xmm0[0,0,0,0]
        pcmpeqd xmm1, xmm1
        jmp     .LBB2_7
.LBB2_46:                               #   in Loop: Header=BB2_7 Depth=1
        sub     rdi, rsi
        sub     rcx, rsi
.LBB2_47:                               #   in Loop: Header=BB2_7 Depth=1
        mov     rax, qword ptr [rsp - 8]        # 8-byte Reload
        lea     rbp, [rcx + 4*rax]
        mov     rax, qword ptr [rsp - 16]       # 8-byte Reload
        lea     r14, [rdi + 4*rax]
        inc     r13d
        cmp     r13d, r11d
        je      .LBB2_48
.LBB2_7:                                # =>This Loop Header: Depth=1
        cmp     r15d, 7
        jb      .LBB2_8
        mov     rax, rbp
        sub     rax, r14
        cmp     rax, 32
        jb      .LBB2_8
        lea     rdi, [r14 + r10]
        lea     rcx, [r10 + rbp]
        xor     r12d, r12d
        jmp     .LBB2_11
.LBB2_27:                               #   in Loop: Header=BB2_11 Depth=2
        add     r12, 8
        cmp     rdx, r12
        je      .LBB2_28
.LBB2_11:                               #   Parent Loop BB2_7 Depth=1
        movdqu  xmm3, xmmword ptr [r14 + 4*r12]
        movdqu  xmm2, xmmword ptr [r14 + 4*r12 + 16]
        movdqa  xmm4, xmm3
        pcmpeqd xmm4, xmm0
        movd    eax, xmm4
        not     eax
        test    al, 1
        jne     .LBB2_12
        pxor    xmm4, xmm1
        pextrw  eax, xmm4, 2
        test    al, 1
        jne     .LBB2_14
.LBB2_15:                               #   in Loop: Header=BB2_11 Depth=2
        pextrw  eax, xmm4, 4
        test    al, 1
        jne     .LBB2_16
.LBB2_17:                               #   in Loop: Header=BB2_11 Depth=2
        pextrw  eax, xmm4, 6
        test    al, 1
        je      .LBB2_19
.LBB2_18:                               #   in Loop: Header=BB2_11 Depth=2
        pshufd  xmm3, xmm3, 255                 # xmm3 = xmm3[3,3,3,3]
        movd    dword ptr [rbp + 4*r12 + 12], xmm3
.LBB2_19:                               #   in Loop: Header=BB2_11 Depth=2
        movdqa  xmm3, xmm2
        pcmpeqd xmm3, xmm0
        movd    eax, xmm3
        not     eax
        test    al, 1
        jne     .LBB2_20
        pxor    xmm3, xmm1
        pextrw  eax, xmm3, 2
        test    al, 1
        jne     .LBB2_22
.LBB2_23:                               #   in Loop: Header=BB2_11 Depth=2
        pextrw  eax, xmm3, 4
        test    al, 1
        jne     .LBB2_24
.LBB2_25:                               #   in Loop: Header=BB2_11 Depth=2
        pextrw  eax, xmm3, 6
        test    al, 1
        je      .LBB2_27
        jmp     .LBB2_26
.LBB2_12:                               #   in Loop: Header=BB2_11 Depth=2
        movd    dword ptr [rbp + 4*r12], xmm3
        pxor    xmm4, xmm1
        pextrw  eax, xmm4, 2
        test    al, 1
        je      .LBB2_15
.LBB2_14:                               #   in Loop: Header=BB2_11 Depth=2
        pshufd  xmm5, xmm3, 85                  # xmm5 = xmm3[1,1,1,1]
        movd    dword ptr [rbp + 4*r12 + 4], xmm5
        pextrw  eax, xmm4, 4
        test    al, 1
        je      .LBB2_17
.LBB2_16:                               #   in Loop: Header=BB2_11 Depth=2
        pshufd  xmm5, xmm3, 238                 # xmm5 = xmm3[2,3,2,3]
        movd    dword ptr [rbp + 4*r12 + 8], xmm5
        pextrw  eax, xmm4, 6
        test    al, 1
        jne     .LBB2_18
        jmp     .LBB2_19
.LBB2_20:                               #   in Loop: Header=BB2_11 Depth=2
        movd    dword ptr [rbp + 4*r12 + 16], xmm2
        pxor    xmm3, xmm1
        pextrw  eax, xmm3, 2
        test    al, 1
        je      .LBB2_23
.LBB2_22:                               #   in Loop: Header=BB2_11 Depth=2
        pshufd  xmm4, xmm2, 85                  # xmm4 = xmm2[1,1,1,1]
        movd    dword ptr [rbp + 4*r12 + 20], xmm4
        pextrw  eax, xmm3, 4
        test    al, 1
        je      .LBB2_25
.LBB2_24:                               #   in Loop: Header=BB2_11 Depth=2
        pshufd  xmm4, xmm2, 238                 # xmm4 = xmm2[2,3,2,3]
        movd    dword ptr [rbp + 4*r12 + 24], xmm4
        pextrw  eax, xmm3, 6
        test    al, 1
        je      .LBB2_27
.LBB2_26:                               #   in Loop: Header=BB2_11 Depth=2
        pshufd  xmm2, xmm2, 255                 # xmm2 = xmm2[3,3,3,3]
        movd    dword ptr [rbp + 4*r12 + 28], xmm2
        jmp     .LBB2_27
.LBB2_8:                                #   in Loop: Header=BB2_7 Depth=1
        xor     r12d, r12d
        mov     rdi, r14
        mov     rcx, rbp
        jmp     .LBB2_29
.LBB2_28:                               #   in Loop: Header=BB2_7 Depth=1
        mov     r12d, edx
        cmp     qword ptr [rsp - 24], rdx       # 8-byte Folded Reload
        je      .LBB2_47
.LBB2_29:                               #   in Loop: Header=BB2_7 Depth=1
        mov     rax, qword ptr [rsp - 32]       # 8-byte Reload
        add     eax, r12d
        mov     ebp, r9d
        sub     ebp, eax
        mov     ebx, r15d
        sub     ebx, r12d
        and     ebp, 3
        je      .LBB2_35
        neg     ebp
        xor     eax, eax
        jmp     .LBB2_31
.LBB2_33:                               #   in Loop: Header=BB2_31 Depth=2
        add     rdi, 4
        add     rcx, 4
        dec     eax
        cmp     ebp, eax
        je      .LBB2_34
.LBB2_31:                               #   Parent Loop BB2_7 Depth=1
        mov     esi, dword ptr [rdi]
        cmp     esi, r8d
        je      .LBB2_33
        mov     dword ptr [rcx], esi
        jmp     .LBB2_33
.LBB2_34:                               #   in Loop: Header=BB2_7 Depth=1
        sub     r12d, eax
.LBB2_35:                               #   in Loop: Header=BB2_7 Depth=1
        cmp     ebx, 3
        jb      .LBB2_47
        mov     eax, dword ptr [rsp - 36]       # 4-byte Reload
        mov     ebx, eax
        sub     ebx, r12d
        xor     esi, esi
        xor     ebp, ebp
        jmp     .LBB2_37
.LBB2_45:                               #   in Loop: Header=BB2_37 Depth=2
        add     rbp, 4
        add     rsi, -16
        cmp     ebx, ebp
        je      .LBB2_46
.LBB2_37:                               #   Parent Loop BB2_7 Depth=1
        mov     eax, dword ptr [rdi + 4*rbp]
        cmp     eax, r8d
        jne     .LBB2_38
        mov     eax, dword ptr [rdi + 4*rbp + 4]
        cmp     eax, r8d
        jne     .LBB2_40
.LBB2_41:                               #   in Loop: Header=BB2_37 Depth=2
        mov     eax, dword ptr [rdi + 4*rbp + 8]
        cmp     eax, r8d
        jne     .LBB2_42
.LBB2_43:                               #   in Loop: Header=BB2_37 Depth=2
        mov     eax, dword ptr [rdi + 4*rbp + 12]
        cmp     eax, r8d
        je      .LBB2_45
        jmp     .LBB2_44
.LBB2_38:                               #   in Loop: Header=BB2_37 Depth=2
        mov     dword ptr [rcx + 4*rbp], eax
        mov     eax, dword ptr [rdi + 4*rbp + 4]
        cmp     eax, r8d
        je      .LBB2_41
.LBB2_40:                               #   in Loop: Header=BB2_37 Depth=2
        mov     dword ptr [rcx + 4*rbp + 4], eax
        mov     eax, dword ptr [rdi + 4*rbp + 8]
        cmp     eax, r8d
        je      .LBB2_43
.LBB2_42:                               #   in Loop: Header=BB2_37 Depth=2
        mov     dword ptr [rcx + 4*rbp + 8], eax
        mov     eax, dword ptr [rdi + 4*rbp + 12]
        cmp     eax, r8d
        je      .LBB2_45
.LBB2_44:                               #   in Loop: Header=BB2_37 Depth=2
        mov     dword ptr [rcx + 4*rbp + 12], eax
        jmp     .LBB2_45
.LBB2_48:
        pop     rbx
        pop     r12
        pop     r13
        pop     r14
        pop     r15
        pop     rbp
        ret