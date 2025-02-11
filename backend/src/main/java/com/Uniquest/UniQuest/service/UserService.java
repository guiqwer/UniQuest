package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.user.UserProfileAvatarDTO;
import com.Uniquest.UniQuest.dto.user.UserEditProfileDTO;
import com.Uniquest.UniQuest.dto.user.UserProfileDTO;
import com.Uniquest.UniQuest.exceptions.ImageProcessingException;
import com.Uniquest.UniQuest.exceptions.UserNotFoundException;
import com.Uniquest.UniQuest.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    //Método para atualizar o perfil do usuário
    public User updateUserProfile(String userID, UserEditProfileDTO updateUserProfile) {
        Optional<User> optionalUser = userRepository.findById(userID);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUsername(updateUserProfile.username());
            user.setEducation(updateUserProfile.education());
            user.setFavoriteSubject(updateUserProfile.favoriteSubject());
            user.setAreaOfInterest(updateUserProfile.areaOfInterest());
            return userRepository.save(user); // Salva no banco de dados
        } else {
            throw new UserNotFoundException("Perfil não encontrado para o usuário com ID " + userID);
        }
    }

    public ResponseEntity<Void> updateUserAvatar(String userID, UserProfileAvatarDTO avatarFileDTO) {
        Optional<User> optionalUserProfile = userRepository.findById(userID);
        if (optionalUserProfile.isPresent()) {
            User userProfile = optionalUserProfile.get();
            try {
                byte[] avatarBytes = avatarFileDTO.avatarFile().getBytes();
                userProfile.setAvatar(avatarBytes);
            } catch (IOException e) {
                throw new ImageProcessingException("Erro ao processar a imagem para o usuário com ID " + userProfile.getId());
            }
            userRepository.save(userProfile);
            return ResponseEntity.noContent().build();
        } else {
            throw new UserNotFoundException("Perfil não encontrado para o usuário com ID " + userID);
        }
    }


    public void deleteUserAvatar(String userID) {
        User userProfile = userRepository.findById(userID)
                .orElseThrow(() -> new UserNotFoundException("Perfil não encontrado para o usuário com ID " + userID));;
        // Definir o avatar como null para "deletar" o avatar
        userProfile.setAvatar(null);
        // Salvar as alterações no banco de dados
        userRepository.save(userProfile);
    }

    public UserProfileDTO getUserById(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));

        return new UserProfileDTO(
                user.getName(),
                user.getEmail(),
                user.getUsername(),
                user.getEducation(),
                user.getAreaOfInterest(),
                user.getFavoriteSubject(),
                user.getAvatar()
        );
    }
}
