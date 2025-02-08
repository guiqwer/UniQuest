package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.exam.Exam;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;


@Repository
public class ExamCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Exam> findByFilters(String title, String description, List<String> tags) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Exam> query = cb.createQuery(Exam.class);
        Root<Exam> root = query.from(Exam.class);

        List<Predicate> predicates = new ArrayList<>();

        if (title != null && !title.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
        }

        if (description != null && !description.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase() + "%"));
        }

        if (tags != null && !tags.isEmpty()) {
            Join<Exam, String> tagsJoin = root.join("tags");  // 🔥 Corrigindo o erro com JOIN
            predicates.add(tagsJoin.in(tags));
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));

        return entityManager.createQuery(query).getResultList();
    }


}