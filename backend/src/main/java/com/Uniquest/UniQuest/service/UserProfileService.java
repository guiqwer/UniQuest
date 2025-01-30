package com.Uniquest.UniQuest.service;


import com.Uniquest.UniQuest.domain.user.UserProfile;
import com.Uniquest.UniQuest.dto.UserProfileAvatarDTO;
import com.Uniquest.UniQuest.dto.UserProfileDTO;
import com.Uniquest.UniQuest.repositories.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    UserProfileRepository userProfileRepository;

    //Método para atualizar o perfil do usuário
    public UserProfile updateUserProfile(Long userID, UserProfileDTO updateUserProfile) {
        //verificar se o usuário tem um perfil
        Optional<UserProfile> optinalUserProfile = userProfileRepository.findById(userID);

        if(optinalUserProfile.isPresent()) {
            UserProfile userProfile = optinalUserProfile.get();

            //Atualizar os campos conforme necessário
            userProfile.setEducation(updateUserProfile.education());
            userProfile.setFavoriteSubject(updateUserProfile.favoriteSubject());
            userProfile.setAreaOfInterest(updateUserProfile.areaOfInterest());

            return userProfileRepository.save(userProfile);
        } else {
            throw new RuntimeException("Perfil não encontrado para o usuário com ID" + userID);
        }
    }


    //Método para dar upload no avatar.
    public UserProfile updateUserAvatar(Long userID, UserProfileAvatarDTO avatarFileDTO) {
        Optional<UserProfile> optionalUserProfile = userProfileRepository.findById(userID);

        if (optionalUserProfile.isPresent()) {
            UserProfile userProfile = optionalUserProfile.get();

            try {
                // Obtém os bytes do arquivo MultipartFile a partir do DTO
                byte[] avatarBytes = avatarFileDTO.avatarFile().getBytes();
                userProfile.setAvatar(avatarBytes); // Converte a imagem para bytes
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar a imagem", e);
            }

            return userProfileRepository.save(userProfile);
        } else {
            throw new RuntimeException("Perfil não encontrado para o usuário com ID " + userID);
        }
    }

    //Metodo para deleter avatar.
    public void deleteUserAvatar(Long userID) {
        UserProfile userProfile = userProfileRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));

        // Definir o avatar como null para "deletar" o avatar
        userProfile.setAvatar(null);

        // Salvar as alterações no banco de dados
        userProfileRepository.save(userProfile);
    }




}
