-- town --------------------------------------------
INSERT INTO town ("id", "name") VALUES ( 1, 'Ciudad' );
ALTER SEQUENCE town_id_seq RESTART WITH 2;

-- location_type --------------------------------------------
INSERT INTO location_type ("id", "description") VALUES ( 0, 'Desconocido' );
INSERT INTO location_type ("id", "description") VALUES ( 1, 'Solar privado' );
INSERT INTO location_type ("id", "description") VALUES ( 2, 'Solar público' );
INSERT INTO location_type ("id", "description") VALUES ( 3, 'Centro educativo' );
INSERT INTO location_type ("id", "description") VALUES ( 4, 'Campo' );

ALTER SEQUENCE location_type_id_seq RESTART WITH 5;

-- environment --------------------------------------------
INSERT INTO environment ("id", "description") VALUES ( 0, 'Desconocido' );
INSERT INTO environment ("id", "description") VALUES ( 1, 'Urbano' );
INSERT INTO environment ("id", "description") VALUES ( 2, 'Periferia' );
INSERT INTO environment ("id", "description") VALUES ( 3, 'Selecciona' );

ALTER SEQUENCE environment_id_seq RESTART WITH 4;

-- color --------------------------------------------
INSERT INTO color ("id", "description") VALUES ( 0, 'Desconocido' );
INSERT INTO color ("id", "description") VALUES ( 1, 'Atigrado' );
INSERT INTO color ("id", "description") VALUES ( 2, 'Azul' );
INSERT INTO color ("id", "description") VALUES ( 3, 'Blanco' );
INSERT INTO color ("id", "description") VALUES ( 4, 'Calico' );
INSERT INTO color ("id", "description") VALUES ( 5, 'Canela' );
INSERT INTO color ("id", "description") VALUES ( 6, 'Carey' );
INSERT INTO color ("id", "description") VALUES ( 7, 'Chocolate' );
INSERT INTO color ("id", "description") VALUES ( 8, 'Crema' );
INSERT INTO color ("id", "description") VALUES ( 9, 'Gris' );
INSERT INTO color ("id", "description") VALUES ( 10, 'Negro' );
INSERT INTO color ("id", "description") VALUES ( 11, 'Rojo' );
INSERT INTO color ("id", "description") VALUES ( 12, 'Diluído' );

ALTER SEQUENCE color_id_seq RESTART WITH 13;

-- pattern --------------------------------------------
INSERT INTO pattern ("id", "description") VALUES ( 0, 'Desconocido' );
INSERT INTO pattern ("id", "description") VALUES ( 1, 'Particolor' );
INSERT INTO pattern ("id", "description") VALUES ( 2, 'Point' );
INSERT INTO pattern ("id", "description") VALUES ( 3, 'Sólido' );
INSERT INTO pattern ("id", "description") VALUES ( 4, 'Tabby' );
INSERT INTO pattern ("id", "description") VALUES ( 5, 'Tricolor' );

ALTER SEQUENCE pattern_id_seq RESTART WITH 6;

-- eye_color --------------------------------------------
INSERT INTO eye_color ("id", "description") VALUES ( 0, 'Desconocido' );
INSERT INTO eye_color ("id", "description") VALUES ( 1, 'Amarillo' );
INSERT INTO eye_color ("id", "description") VALUES ( 2, 'Ambar' );
INSERT INTO eye_color ("id", "description") VALUES ( 3, 'Azul' );
INSERT INTO eye_color ("id", "description") VALUES ( 4, 'Gris' );
INSERT INTO eye_color ("id", "description") VALUES ( 5, 'Marrón' );
INSERT INTO eye_color ("id", "description") VALUES ( 6, 'Miel' );
INSERT INTO eye_color ("id", "description") VALUES ( 7, 'Verde' );

ALTER SEQUENCE eye_color_id_seq RESTART WITH 8;

-- cease_cause --------------------------------------------
INSERT INTO cease_cause ("id", "description") VALUES ( 0, 'Desconocido' );
INSERT INTO cease_cause ("id", "description") VALUES ( 1, 'Desaparición' );
INSERT INTO cease_cause ("id", "description") VALUES ( 2, 'Atropello' );
INSERT INTO cease_cause ("id", "description") VALUES ( 3, 'Adopción' );
INSERT INTO cease_cause ("id", "description") VALUES ( 4, 'Acogida' );
INSERT INTO cease_cause ("id", "description") VALUES ( 5, 'Eutanasia' );

ALTER SEQUENCE cease_cause_id_seq RESTART WITH 6;

-- role --------------------------------------------
INSERT INTO role ("id", "description") VALUES ( 1, 'Administrador' );
INSERT INTO role ("id", "description") VALUES ( 2, 'Gestor' );

ALTER SEQUENCE role_id_seq RESTART WITH 3;

-- user ------ pass:admin --------------------------------
INSERT INTO "user" ("id", "createdAt", "name", "surnames", "idCard", "phoneNumber", "email", "ceasedAt", "authorizesWhatsApp", "password", "roleId") VALUES ( 1, '2021-12-23', 'Administrador', '', '1', '1', 'admin@cats.org', null, False, '$2b$10$5AQLNBQtDQA3JQaigfCcruE7XF6MU3WzQWEpn28yhyuWI5ENn2H2C', 1 );
INSERT INTO "user" ("id", "createdAt", "name", "surnames", "idCard", "phoneNumber", "email", "ceasedAt", "authorizesWhatsApp", "password", "roleId") VALUES ( 2, '2021-12-23', 'Gestor', '', '2', '2', 'manager@cats.org', null, False, '$2b$10$5AQLNBQtDQA3JQaigfCcruE7XF6MU3WzQWEpn28yhyuWI5ENn2H2C', 2 );

ALTER SEQUENCE user_id_seq RESTART WITH 3;

