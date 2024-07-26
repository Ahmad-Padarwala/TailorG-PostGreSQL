toc.dat                                                                                             0000600 0004000 0002000 00000063164 14626041706 0014457 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP   2                    |           tailorg    16.3    16.3 U               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                    0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                    0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                    1262    16398    tailorg    DATABASE     z   CREATE DATABASE tailorg WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE tailorg;
                postgres    false         �            1259    16417 
   body_parts    TABLE     �   CREATE TABLE public.body_parts (
    id integer NOT NULL,
    part_name text,
    gender text,
    status integer,
    shop_id integer
);
    DROP TABLE public.body_parts;
       public         heap    postgres    false         �            1259    16577    body_parts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.body_parts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 (   DROP SEQUENCE public.body_parts_id_seq;
       public          postgres    false    217                    0    0    body_parts_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.body_parts_id_seq OWNED BY public.body_parts.id;
          public          postgres    false    224         �            1259    16407    customer    TABLE     �   CREATE TABLE public.customer (
    id integer NOT NULL,
    customer_name text,
    mobile_number text,
    email text,
    gender text,
    address text,
    pincode integer,
    created_date date,
    updated_date date,
    shop_id integer
);
    DROP TABLE public.customer;
       public         heap    postgres    false         �            1259    16575    customer_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 &   DROP SEQUENCE public.customer_id_seq;
       public          postgres    false    216                    0    0    customer_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.customer_id_seq OWNED BY public.customer.id;
          public          postgres    false    223         �            1259    16457    customer_measurement    TABLE     �   CREATE TABLE public.customer_measurement (
    id integer NOT NULL,
    name text,
    dresses_id integer,
    customer_id integer,
    shop_id integer
);
 (   DROP TABLE public.customer_measurement;
       public         heap    postgres    false         �            1259    16579    customer_measurement_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customer_measurement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 2   DROP SEQUENCE public.customer_measurement_id_seq;
       public          postgres    false    220                    0    0    customer_measurement_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.customer_measurement_id_seq OWNED BY public.customer_measurement.id;
          public          postgres    false    225         �            1259    16477    customer_measurement_value    TABLE     �   CREATE TABLE public.customer_measurement_value (
    id integer NOT NULL,
    dresses_part_id integer,
    value text,
    customer_measurement_id integer,
    customer_id integer,
    shop_id integer
);
 .   DROP TABLE public.customer_measurement_value;
       public         heap    postgres    false         �            1259    16581 !   customer_measurement_value_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customer_measurement_value_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 8   DROP SEQUENCE public.customer_measurement_value_id_seq;
       public          postgres    false    221                    0    0 !   customer_measurement_value_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.customer_measurement_value_id_seq OWNED BY public.customer_measurement_value.id;
          public          postgres    false    226         �            1259    16502    customer_order    TABLE       CREATE TABLE public.customer_order (
    id integer NOT NULL,
    price text,
    qty text,
    order_date date,
    delivery_date date,
    special_note text,
    urgent text,
    customer_measurement_id integer,
    customer_id integer,
    shop_id integer
);
 "   DROP TABLE public.customer_order;
       public         heap    postgres    false         �            1259    16583    customer_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customer_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 ,   DROP SEQUENCE public.customer_order_id_seq;
       public          postgres    false    222                    0    0    customer_order_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.customer_order_id_seq OWNED BY public.customer_order.id;
          public          postgres    false    227         �            1259    16427    dresses    TABLE     �   CREATE TABLE public.dresses (
    id integer NOT NULL,
    dress_name text,
    dress_price text,
    gender text,
    dress_image text,
    shop_id integer
);
    DROP TABLE public.dresses;
       public         heap    postgres    false         �            1259    16586    dresses_id_seq    SEQUENCE        CREATE SEQUENCE public.dresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 %   DROP SEQUENCE public.dresses_id_seq;
       public          postgres    false    218                    0    0    dresses_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.dresses_id_seq OWNED BY public.dresses.id;
          public          postgres    false    228         �            1259    16437    dresses_part    TABLE     �   CREATE TABLE public.dresses_part (
    id integer NOT NULL,
    body_part_id integer,
    dresses_id integer,
    shop_id integer
);
     DROP TABLE public.dresses_part;
       public         heap    postgres    false         �            1259    16588    dresses_part_id_seq    SEQUENCE     �   CREATE SEQUENCE public.dresses_part_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 *   DROP SEQUENCE public.dresses_part_id_seq;
       public          postgres    false    219                    0    0    dresses_part_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.dresses_part_id_seq OWNED BY public.dresses_part.id;
          public          postgres    false    229         �            1259    16592    payment    TABLE     �   CREATE TABLE public.payment (
    id integer NOT NULL,
    amount text,
    rounded text,
    payment_mode text,
    remark text,
    payment_date date,
    recieved_by text,
    updated_by text,
    customer_id integer,
    shop_id integer
);
    DROP TABLE public.payment;
       public         heap    postgres    false         �            1259    16609    payment_id_seq    SEQUENCE        CREATE SEQUENCE public.payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 %   DROP SEQUENCE public.payment_id_seq;
       public          postgres    false    231                    0    0    payment_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.payment_id_seq OWNED BY public.payment.id;
          public          postgres    false    232         �            1259    16399    shops    TABLE       CREATE TABLE public.shops (
    id integer NOT NULL,
    first_name text,
    last_name text,
    shop_name text,
    contact_number text,
    email text,
    password text,
    profile_img text,
    created_date date,
    updated_date date,
    updated_by text DEFAULT NULL::bpchar
);
    DROP TABLE public.shops;
       public         heap    postgres    false         �            1259    16590    shop_id_seq    SEQUENCE     |   CREATE SEQUENCE public.shop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 "   DROP SEQUENCE public.shop_id_seq;
       public          postgres    false    215                    0    0    shop_id_seq    SEQUENCE OWNED BY     <   ALTER SEQUENCE public.shop_id_seq OWNED BY public.shops.id;
          public          postgres    false    230         E           2604    16578    body_parts id    DEFAULT     n   ALTER TABLE ONLY public.body_parts ALTER COLUMN id SET DEFAULT nextval('public.body_parts_id_seq'::regclass);
 <   ALTER TABLE public.body_parts ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    217         D           2604    16576    customer id    DEFAULT     j   ALTER TABLE ONLY public.customer ALTER COLUMN id SET DEFAULT nextval('public.customer_id_seq'::regclass);
 :   ALTER TABLE public.customer ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    216         H           2604    16580    customer_measurement id    DEFAULT     �   ALTER TABLE ONLY public.customer_measurement ALTER COLUMN id SET DEFAULT nextval('public.customer_measurement_id_seq'::regclass);
 F   ALTER TABLE public.customer_measurement ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    220         I           2604    16582    customer_measurement_value id    DEFAULT     �   ALTER TABLE ONLY public.customer_measurement_value ALTER COLUMN id SET DEFAULT nextval('public.customer_measurement_value_id_seq'::regclass);
 L   ALTER TABLE public.customer_measurement_value ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    221         J           2604    16585    customer_order id    DEFAULT     v   ALTER TABLE ONLY public.customer_order ALTER COLUMN id SET DEFAULT nextval('public.customer_order_id_seq'::regclass);
 @   ALTER TABLE public.customer_order ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    222         F           2604    16587 
   dresses id    DEFAULT     h   ALTER TABLE ONLY public.dresses ALTER COLUMN id SET DEFAULT nextval('public.dresses_id_seq'::regclass);
 9   ALTER TABLE public.dresses ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    218         G           2604    16589    dresses_part id    DEFAULT     r   ALTER TABLE ONLY public.dresses_part ALTER COLUMN id SET DEFAULT nextval('public.dresses_part_id_seq'::regclass);
 >   ALTER TABLE public.dresses_part ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    219         K           2604    16610 
   payment id    DEFAULT     h   ALTER TABLE ONLY public.payment ALTER COLUMN id SET DEFAULT nextval('public.payment_id_seq'::regclass);
 9   ALTER TABLE public.payment ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    231         B           2604    16591    shops id    DEFAULT     c   ALTER TABLE ONLY public.shops ALTER COLUMN id SET DEFAULT nextval('public.shop_id_seq'::regclass);
 7   ALTER TABLE public.shops ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    215                   0    16417 
   body_parts 
   TABLE DATA           L   COPY public.body_parts (id, part_name, gender, status, shop_id) FROM stdin;
    public          postgres    false    217       4865.dat            0    16407    customer 
   TABLE DATA           �   COPY public.customer (id, customer_name, mobile_number, email, gender, address, pincode, created_date, updated_date, shop_id) FROM stdin;
    public          postgres    false    216       4864.dat           0    16457    customer_measurement 
   TABLE DATA           Z   COPY public.customer_measurement (id, name, dresses_id, customer_id, shop_id) FROM stdin;
    public          postgres    false    220       4868.dat           0    16477    customer_measurement_value 
   TABLE DATA              COPY public.customer_measurement_value (id, dresses_part_id, value, customer_measurement_id, customer_id, shop_id) FROM stdin;
    public          postgres    false    221       4869.dat           0    16502    customer_order 
   TABLE DATA           �   COPY public.customer_order (id, price, qty, order_date, delivery_date, special_note, urgent, customer_measurement_id, customer_id, shop_id) FROM stdin;
    public          postgres    false    222       4870.dat           0    16427    dresses 
   TABLE DATA           \   COPY public.dresses (id, dress_name, dress_price, gender, dress_image, shop_id) FROM stdin;
    public          postgres    false    218       4866.dat           0    16437    dresses_part 
   TABLE DATA           M   COPY public.dresses_part (id, body_part_id, dresses_id, shop_id) FROM stdin;
    public          postgres    false    219       4867.dat           0    16592    payment 
   TABLE DATA           �   COPY public.payment (id, amount, rounded, payment_mode, remark, payment_date, recieved_by, updated_by, customer_id, shop_id) FROM stdin;
    public          postgres    false    231       4879.dat �          0    16399    shops 
   TABLE DATA           �   COPY public.shops (id, first_name, last_name, shop_name, contact_number, email, password, profile_img, created_date, updated_date, updated_by) FROM stdin;
    public          postgres    false    215       4863.dat             0    0    body_parts_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.body_parts_id_seq', 1, false);
          public          postgres    false    224         !           0    0    customer_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.customer_id_seq', 13, true);
          public          postgres    false    223         "           0    0    customer_measurement_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.customer_measurement_id_seq', 1, false);
          public          postgres    false    225         #           0    0 !   customer_measurement_value_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.customer_measurement_value_id_seq', 1, false);
          public          postgres    false    226         $           0    0    customer_order_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.customer_order_id_seq', 1, false);
          public          postgres    false    227         %           0    0    dresses_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.dresses_id_seq', 1, false);
          public          postgres    false    228         &           0    0    dresses_part_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.dresses_part_id_seq', 1, false);
          public          postgres    false    229         '           0    0    payment_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.payment_id_seq', 1, false);
          public          postgres    false    232         (           0    0    shop_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.shop_id_seq', 1, false);
          public          postgres    false    230         Q           2606    16421    body_parts body_parts_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.body_parts
    ADD CONSTRAINT body_parts_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.body_parts DROP CONSTRAINT body_parts_pkey;
       public            postgres    false    217         W           2606    16461 .   customer_measurement customer_measurement_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.customer_measurement
    ADD CONSTRAINT customer_measurement_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.customer_measurement DROP CONSTRAINT customer_measurement_pkey;
       public            postgres    false    220         Y           2606    16481 :   customer_measurement_value customer_measurement_value_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT customer_measurement_value_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.customer_measurement_value DROP CONSTRAINT customer_measurement_value_pkey;
       public            postgres    false    221         [           2606    16508 "   customer_order customer_order_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.customer_order
    ADD CONSTRAINT customer_order_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.customer_order DROP CONSTRAINT customer_order_pkey;
       public            postgres    false    222         O           2606    16411    customer customer_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.customer DROP CONSTRAINT customer_pkey;
       public            postgres    false    216         U           2606    16441    dresses_part dresses_part_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.dresses_part
    ADD CONSTRAINT dresses_part_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.dresses_part DROP CONSTRAINT dresses_part_pkey;
       public            postgres    false    219         S           2606    16431    dresses dresses_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.dresses
    ADD CONSTRAINT dresses_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.dresses DROP CONSTRAINT dresses_pkey;
       public            postgres    false    218         ]           2606    16598    payment payment_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.payment DROP CONSTRAINT payment_pkey;
       public            postgres    false    231         M           2606    16406    shops shops_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.shops DROP CONSTRAINT shops_pkey;
       public            postgres    false    215         a           2606    16447    dresses_part body_part_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.dresses_part
    ADD CONSTRAINT body_part_id_fky FOREIGN KEY (body_part_id) REFERENCES public.body_parts(id);
 G   ALTER TABLE ONLY public.dresses_part DROP CONSTRAINT body_part_id_fky;
       public          postgres    false    4689    217    219         d           2606    16472 $   customer_measurement customer_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_measurement
    ADD CONSTRAINT customer_id_fky FOREIGN KEY (customer_id) REFERENCES public.customer(id);
 N   ALTER TABLE ONLY public.customer_measurement DROP CONSTRAINT customer_id_fky;
       public          postgres    false    220    216    4687         g           2606    16492 *   customer_measurement_value customer_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT customer_id_fky FOREIGN KEY (customer_id) REFERENCES public.customer(id);
 T   ALTER TABLE ONLY public.customer_measurement_value DROP CONSTRAINT customer_id_fky;
       public          postgres    false    4687    216    221         k           2606    16514    customer_order customer_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_order
    ADD CONSTRAINT customer_id_fky FOREIGN KEY (customer_id) REFERENCES public.customer(id);
 H   ALTER TABLE ONLY public.customer_order DROP CONSTRAINT customer_id_fky;
       public          postgres    false    222    4687    216         n           2606    16599    payment customer_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.payment
    ADD CONSTRAINT customer_id_fky FOREIGN KEY (customer_id) REFERENCES public.customer(id) NOT VALID;
 A   ALTER TABLE ONLY public.payment DROP CONSTRAINT customer_id_fky;
       public          postgres    false    231    216    4687         h           2606    16487 6   customer_measurement_value customer_measurement_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT customer_measurement_id_fky FOREIGN KEY (customer_measurement_id) REFERENCES public.customer_measurement(id);
 `   ALTER TABLE ONLY public.customer_measurement_value DROP CONSTRAINT customer_measurement_id_fky;
       public          postgres    false    220    4695    221         l           2606    16509 *   customer_order customer_measurement_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_order
    ADD CONSTRAINT customer_measurement_id_fky FOREIGN KEY (customer_measurement_id) REFERENCES public.customer_measurement(id);
 T   ALTER TABLE ONLY public.customer_order DROP CONSTRAINT customer_measurement_id_fky;
       public          postgres    false    222    4695    220         b           2606    16452    dresses_part dresses_id_fky    FK CONSTRAINT        ALTER TABLE ONLY public.dresses_part
    ADD CONSTRAINT dresses_id_fky FOREIGN KEY (dresses_id) REFERENCES public.dresses(id);
 E   ALTER TABLE ONLY public.dresses_part DROP CONSTRAINT dresses_id_fky;
       public          postgres    false    218    4691    219         e           2606    16467 #   customer_measurement dresses_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_measurement
    ADD CONSTRAINT dresses_id_fky FOREIGN KEY (dresses_id) REFERENCES public.dresses(id);
 M   ALTER TABLE ONLY public.customer_measurement DROP CONSTRAINT dresses_id_fky;
       public          postgres    false    4691    220    218         i           2606    16482 .   customer_measurement_value dresses_part_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT dresses_part_id_fky FOREIGN KEY (dresses_part_id) REFERENCES public.dresses_part(id);
 X   ALTER TABLE ONLY public.customer_measurement_value DROP CONSTRAINT dresses_part_id_fky;
       public          postgres    false    4693    219    221         ^           2606    16412    customer shop_id_fky    FK CONSTRAINT     s   ALTER TABLE ONLY public.customer
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);
 >   ALTER TABLE ONLY public.customer DROP CONSTRAINT shop_id_fky;
       public          postgres    false    4685    216    215         _           2606    16422    body_parts shop_id_fky    FK CONSTRAINT     u   ALTER TABLE ONLY public.body_parts
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);
 @   ALTER TABLE ONLY public.body_parts DROP CONSTRAINT shop_id_fky;
       public          postgres    false    4685    215    217         `           2606    16432    dresses shop_id_fky    FK CONSTRAINT     r   ALTER TABLE ONLY public.dresses
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);
 =   ALTER TABLE ONLY public.dresses DROP CONSTRAINT shop_id_fky;
       public          postgres    false    4685    218    215         c           2606    16442    dresses_part shop_id_fky    FK CONSTRAINT     w   ALTER TABLE ONLY public.dresses_part
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);
 B   ALTER TABLE ONLY public.dresses_part DROP CONSTRAINT shop_id_fky;
       public          postgres    false    219    215    4685         f           2606    16462     customer_measurement shop_id_fky    FK CONSTRAINT        ALTER TABLE ONLY public.customer_measurement
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);
 J   ALTER TABLE ONLY public.customer_measurement DROP CONSTRAINT shop_id_fky;
       public          postgres    false    215    220    4685         j           2606    16497 &   customer_measurement_value shop_id_fky    FK CONSTRAINT     �   ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);
 P   ALTER TABLE ONLY public.customer_measurement_value DROP CONSTRAINT shop_id_fky;
       public          postgres    false    215    221    4685         m           2606    16519    customer_order shop_id_fky    FK CONSTRAINT     y   ALTER TABLE ONLY public.customer_order
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);
 D   ALTER TABLE ONLY public.customer_order DROP CONSTRAINT shop_id_fky;
       public          postgres    false    222    4685    215         o           2606    16604    payment shop_id_fky    FK CONSTRAINT     |   ALTER TABLE ONLY public.payment
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id) NOT VALID;
 =   ALTER TABLE ONLY public.payment DROP CONSTRAINT shop_id_fky;
       public          postgres    false    231    215    4685                                                                                                                                                                                                                                                                                                                                                                                                                    4865.dat                                                                                            0000600 0004000 0002000 00000000005 14626041706 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4864.dat                                                                                            0000600 0004000 0002000 00000001076 14626041706 0014271 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        6	Amil	7698316261	Amilgmail.com	male	Majadar	9876	2024-05-29	2024-05-29	1
7	Nofal	9870654321	Nofal	female	Rajosana chhapi	9638	2024-05-29	2024-05-29	1
8	Ahmad	9870645312	Ahmad	female	Mahi	9870	2024-05-29	2024-05-29	1
9	Amil	698074123	Ghjjbh	female	Bnshhan	980	2024-05-29	2024-05-29	1
10	Ghanbba	9649494	Bbsbsbs	male	Bajjsnan	94994	2024-05-29	2024-05-29	1
11	Bhabs	99494	Bbsbss	female	Vabbsbs	94994	2024-05-29	2024-05-29	1
12	Bsbbs	499494949	Bsbbe	male	Bshbene	64694	2024-05-29	2024-05-29	1
13	Amil	99999698000	Amil	female	Amil majadara\n	385210	2024-05-29	2024-05-29	1
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                  4868.dat                                                                                            0000600 0004000 0002000 00000000005 14626041706 0014264 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4869.dat                                                                                            0000600 0004000 0002000 00000000005 14626041706 0014265 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4870.dat                                                                                            0000600 0004000 0002000 00000000005 14626041706 0014255 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4866.dat                                                                                            0000600 0004000 0002000 00000000005 14626041706 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4867.dat                                                                                            0000600 0004000 0002000 00000000005 14626041706 0014263 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4879.dat                                                                                            0000600 0004000 0002000 00000000005 14626041706 0014266 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           4863.dat                                                                                            0000600 0004000 0002000 00000000050 14626041706 0014257 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	nofal	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        restore.sql                                                                                         0000600 0004000 0002000 00000050255 14626041706 0015401 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE tailorg;
--
-- Name: tailorg; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE tailorg WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';


ALTER DATABASE tailorg OWNER TO postgres;

\connect tailorg

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: body_parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.body_parts (
    id integer NOT NULL,
    part_name text,
    gender text,
    status integer,
    shop_id integer
);


ALTER TABLE public.body_parts OWNER TO postgres;

--
-- Name: body_parts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.body_parts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.body_parts_id_seq OWNER TO postgres;

--
-- Name: body_parts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.body_parts_id_seq OWNED BY public.body_parts.id;


--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id integer NOT NULL,
    customer_name text,
    mobile_number text,
    email text,
    gender text,
    address text,
    pincode integer,
    created_date date,
    updated_date date,
    shop_id integer
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.customer_id_seq OWNER TO postgres;

--
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_id_seq OWNED BY public.customer.id;


--
-- Name: customer_measurement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_measurement (
    id integer NOT NULL,
    name text,
    dresses_id integer,
    customer_id integer,
    shop_id integer
);


ALTER TABLE public.customer_measurement OWNER TO postgres;

--
-- Name: customer_measurement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_measurement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.customer_measurement_id_seq OWNER TO postgres;

--
-- Name: customer_measurement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_measurement_id_seq OWNED BY public.customer_measurement.id;


--
-- Name: customer_measurement_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_measurement_value (
    id integer NOT NULL,
    dresses_part_id integer,
    value text,
    customer_measurement_id integer,
    customer_id integer,
    shop_id integer
);


ALTER TABLE public.customer_measurement_value OWNER TO postgres;

--
-- Name: customer_measurement_value_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_measurement_value_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.customer_measurement_value_id_seq OWNER TO postgres;

--
-- Name: customer_measurement_value_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_measurement_value_id_seq OWNED BY public.customer_measurement_value.id;


--
-- Name: customer_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_order (
    id integer NOT NULL,
    price text,
    qty text,
    order_date date,
    delivery_date date,
    special_note text,
    urgent text,
    customer_measurement_id integer,
    customer_id integer,
    shop_id integer
);


ALTER TABLE public.customer_order OWNER TO postgres;

--
-- Name: customer_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.customer_order_id_seq OWNER TO postgres;

--
-- Name: customer_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_order_id_seq OWNED BY public.customer_order.id;


--
-- Name: dresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dresses (
    id integer NOT NULL,
    dress_name text,
    dress_price text,
    gender text,
    dress_image text,
    shop_id integer
);


ALTER TABLE public.dresses OWNER TO postgres;

--
-- Name: dresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.dresses_id_seq OWNER TO postgres;

--
-- Name: dresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dresses_id_seq OWNED BY public.dresses.id;


--
-- Name: dresses_part; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dresses_part (
    id integer NOT NULL,
    body_part_id integer,
    dresses_id integer,
    shop_id integer
);


ALTER TABLE public.dresses_part OWNER TO postgres;

--
-- Name: dresses_part_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dresses_part_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.dresses_part_id_seq OWNER TO postgres;

--
-- Name: dresses_part_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dresses_part_id_seq OWNED BY public.dresses_part.id;


--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    id integer NOT NULL,
    amount text,
    rounded text,
    payment_mode text,
    remark text,
    payment_date date,
    recieved_by text,
    updated_by text,
    customer_id integer,
    shop_id integer
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.payment_id_seq OWNER TO postgres;

--
-- Name: payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_id_seq OWNED BY public.payment.id;


--
-- Name: shops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shops (
    id integer NOT NULL,
    first_name text,
    last_name text,
    shop_name text,
    contact_number text,
    email text,
    password text,
    profile_img text,
    created_date date,
    updated_date date,
    updated_by text DEFAULT NULL::bpchar
);


ALTER TABLE public.shops OWNER TO postgres;

--
-- Name: shop_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.shop_id_seq OWNER TO postgres;

--
-- Name: shop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shop_id_seq OWNED BY public.shops.id;


--
-- Name: body_parts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.body_parts ALTER COLUMN id SET DEFAULT nextval('public.body_parts_id_seq'::regclass);


--
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer ALTER COLUMN id SET DEFAULT nextval('public.customer_id_seq'::regclass);


--
-- Name: customer_measurement id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement ALTER COLUMN id SET DEFAULT nextval('public.customer_measurement_id_seq'::regclass);


--
-- Name: customer_measurement_value id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement_value ALTER COLUMN id SET DEFAULT nextval('public.customer_measurement_value_id_seq'::regclass);


--
-- Name: customer_order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order ALTER COLUMN id SET DEFAULT nextval('public.customer_order_id_seq'::regclass);


--
-- Name: dresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dresses ALTER COLUMN id SET DEFAULT nextval('public.dresses_id_seq'::regclass);


--
-- Name: dresses_part id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dresses_part ALTER COLUMN id SET DEFAULT nextval('public.dresses_part_id_seq'::regclass);


--
-- Name: payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment ALTER COLUMN id SET DEFAULT nextval('public.payment_id_seq'::regclass);


--
-- Name: shops id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops ALTER COLUMN id SET DEFAULT nextval('public.shop_id_seq'::regclass);


--
-- Data for Name: body_parts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.body_parts (id, part_name, gender, status, shop_id) FROM stdin;
\.
COPY public.body_parts (id, part_name, gender, status, shop_id) FROM '$$PATH$$/4865.dat';

--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, customer_name, mobile_number, email, gender, address, pincode, created_date, updated_date, shop_id) FROM stdin;
\.
COPY public.customer (id, customer_name, mobile_number, email, gender, address, pincode, created_date, updated_date, shop_id) FROM '$$PATH$$/4864.dat';

--
-- Data for Name: customer_measurement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_measurement (id, name, dresses_id, customer_id, shop_id) FROM stdin;
\.
COPY public.customer_measurement (id, name, dresses_id, customer_id, shop_id) FROM '$$PATH$$/4868.dat';

--
-- Data for Name: customer_measurement_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_measurement_value (id, dresses_part_id, value, customer_measurement_id, customer_id, shop_id) FROM stdin;
\.
COPY public.customer_measurement_value (id, dresses_part_id, value, customer_measurement_id, customer_id, shop_id) FROM '$$PATH$$/4869.dat';

--
-- Data for Name: customer_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_order (id, price, qty, order_date, delivery_date, special_note, urgent, customer_measurement_id, customer_id, shop_id) FROM stdin;
\.
COPY public.customer_order (id, price, qty, order_date, delivery_date, special_note, urgent, customer_measurement_id, customer_id, shop_id) FROM '$$PATH$$/4870.dat';

--
-- Data for Name: dresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dresses (id, dress_name, dress_price, gender, dress_image, shop_id) FROM stdin;
\.
COPY public.dresses (id, dress_name, dress_price, gender, dress_image, shop_id) FROM '$$PATH$$/4866.dat';

--
-- Data for Name: dresses_part; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dresses_part (id, body_part_id, dresses_id, shop_id) FROM stdin;
\.
COPY public.dresses_part (id, body_part_id, dresses_id, shop_id) FROM '$$PATH$$/4867.dat';

--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (id, amount, rounded, payment_mode, remark, payment_date, recieved_by, updated_by, customer_id, shop_id) FROM stdin;
\.
COPY public.payment (id, amount, rounded, payment_mode, remark, payment_date, recieved_by, updated_by, customer_id, shop_id) FROM '$$PATH$$/4879.dat';

--
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shops (id, first_name, last_name, shop_name, contact_number, email, password, profile_img, created_date, updated_date, updated_by) FROM stdin;
\.
COPY public.shops (id, first_name, last_name, shop_name, contact_number, email, password, profile_img, created_date, updated_date, updated_by) FROM '$$PATH$$/4863.dat';

--
-- Name: body_parts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.body_parts_id_seq', 1, false);


--
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_id_seq', 13, true);


--
-- Name: customer_measurement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_measurement_id_seq', 1, false);


--
-- Name: customer_measurement_value_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_measurement_value_id_seq', 1, false);


--
-- Name: customer_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_order_id_seq', 1, false);


--
-- Name: dresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dresses_id_seq', 1, false);


--
-- Name: dresses_part_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dresses_part_id_seq', 1, false);


--
-- Name: payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_id_seq', 1, false);


--
-- Name: shop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shop_id_seq', 1, false);


--
-- Name: body_parts body_parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.body_parts
    ADD CONSTRAINT body_parts_pkey PRIMARY KEY (id);


--
-- Name: customer_measurement customer_measurement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement
    ADD CONSTRAINT customer_measurement_pkey PRIMARY KEY (id);


--
-- Name: customer_measurement_value customer_measurement_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT customer_measurement_value_pkey PRIMARY KEY (id);


--
-- Name: customer_order customer_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order
    ADD CONSTRAINT customer_order_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: dresses_part dresses_part_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dresses_part
    ADD CONSTRAINT dresses_part_pkey PRIMARY KEY (id);


--
-- Name: dresses dresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dresses
    ADD CONSTRAINT dresses_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (id);


--
-- Name: dresses_part body_part_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dresses_part
    ADD CONSTRAINT body_part_id_fky FOREIGN KEY (body_part_id) REFERENCES public.body_parts(id);


--
-- Name: customer_measurement customer_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement
    ADD CONSTRAINT customer_id_fky FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: customer_measurement_value customer_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT customer_id_fky FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: customer_order customer_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order
    ADD CONSTRAINT customer_id_fky FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: payment customer_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT customer_id_fky FOREIGN KEY (customer_id) REFERENCES public.customer(id) NOT VALID;


--
-- Name: customer_measurement_value customer_measurement_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT customer_measurement_id_fky FOREIGN KEY (customer_measurement_id) REFERENCES public.customer_measurement(id);


--
-- Name: customer_order customer_measurement_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order
    ADD CONSTRAINT customer_measurement_id_fky FOREIGN KEY (customer_measurement_id) REFERENCES public.customer_measurement(id);


--
-- Name: dresses_part dresses_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dresses_part
    ADD CONSTRAINT dresses_id_fky FOREIGN KEY (dresses_id) REFERENCES public.dresses(id);


--
-- Name: customer_measurement dresses_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement
    ADD CONSTRAINT dresses_id_fky FOREIGN KEY (dresses_id) REFERENCES public.dresses(id);


--
-- Name: customer_measurement_value dresses_part_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT dresses_part_id_fky FOREIGN KEY (dresses_part_id) REFERENCES public.dresses_part(id);


--
-- Name: customer shop_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: body_parts shop_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.body_parts
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: dresses shop_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dresses
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: dresses_part shop_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dresses_part
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: customer_measurement shop_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: customer_measurement_value shop_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_measurement_value
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: customer_order shop_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- Name: payment shop_id_fky; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT shop_id_fky FOREIGN KEY (shop_id) REFERENCES public.shops(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   