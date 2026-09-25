-- Optional Category on an Article, and an optional hero crop point.
-- category_id is independent of article_listings. The public page uses it
-- to show the three latest active Listings in that Category.
-- Null focal columns mean the page chooses a point from the photo.
-- A saved point is 0–100 on each axis. Both are null, or both are set.

alter table public.articles
  add column category_id uuid references public.categories (id) on delete restrict,
  add column hero_focal_x smallint,
  add column hero_focal_y smallint;

create index articles_category_id_idx on public.articles (category_id);

alter table public.articles
  add constraint articles_hero_focal_x_range
    check (hero_focal_x is null or hero_focal_x between 0 and 100),
  add constraint articles_hero_focal_y_range
    check (hero_focal_y is null or hero_focal_y between 0 and 100),
  add constraint articles_hero_focal_pair
    check (
      (hero_focal_x is null and hero_focal_y is null)
      or (hero_focal_x is not null and hero_focal_y is not null)
    );
