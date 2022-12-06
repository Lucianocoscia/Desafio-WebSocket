import { Router } from "express";

const router = Router();
const productos = [];

router.get("/", (req, res) => {
  res.render("../views/partials/form.hbs");
});

router.get("/products", (req, res) => {
  res.render("../views/partials/products.hbs", { productos });
});

/* router.post("/product", (req, res) => {
  const { name, price, thumbnail } = req.body;
  console.log(req.body);
  productos.push({ name, price, thumbnail });

  res.redirect("/");
}); */

export default router;
