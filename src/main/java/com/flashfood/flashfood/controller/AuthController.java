package com.flashfood.flashfood.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.flashfood.flashfood.config.JwtService;
import com.flashfood.flashfood.fachada.FlashfoodFachada;
import com.flashfood.flashfood.model.Usuario;

record LoginDTORequest(String email, String senha) {}
record LoginDTOResponse(String token, String tipo) {}

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private FlashfoodFachada fachada;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public LoginDTOResponse login(@RequestBody LoginDTORequest dto) throws Exception {
        Usuario usuario = fachada.login(dto.email(), dto.senha());
        String token = jwtService.gerarToken(usuario);
        return new LoginDTOResponse(token, usuario.getTipoUsuario());
    }
}