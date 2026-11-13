package com.upn.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {

    @GetMapping("/")
    public String index() {
        // Redirige la raíz del backend directamente a la documentación interactiva de Swagger UI
        return "redirect:/swagger-ui.html";
    }
}
