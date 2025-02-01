package com.Uniquest.UniQuest.controllers;

import com.Uniquest.UniQuest.domain.user.UserProfile;
import com.Uniquest.UniQuest.dto.UserProfileDTO;
import com.Uniquest.UniQuest.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user-profile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;



    //Endpoint para editar o perfil do usuário
    @PutMapping("/edit-profile/")
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfileDTO userProfileDTO, @RequestParam Long userId){
        UserProfile updateProfile = userProfileService.updateUserProfile(userId, userProfileDTO);

        if(updateProfile != null){
            return ResponseEntity.ok(updateProfile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userID}/upload-avatar")
    public ResponseEntity<UserProfile> updateAvatar(@PathVariable Long userID,
                                                    @RequestBody UserProfileDTO avatarFileDTO){
        try {
            UserProfile updateProfile = userProfileService.updateUserProfile(userID, avatarFileDTO);
            return ResponseEntity.ok(updateProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null); //Tratar melhor o ERRO depois.
        }
    }

    @DeleteMapping("/{userID}/delete-avatar")
    public ResponseEntity<String> deleteAvatar(@PathVariable Long userID) {
        try {
            userProfileService.deleteUserAvatar(userID);
            return ResponseEntity.ok("Avatar deletado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Erro ao deletar avatar");
        }
    }


}
