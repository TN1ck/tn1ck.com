import type { NextPage } from "next"
import Link from "next/link"
import Container from "../../components/container"
import { CodeBlock } from "../../components/code-block"

import React, { useState } from "react"

// Define types
type Product = {
  ID: string
  Price: number
}

type ProductPair = {
  OldProduct: Product
  NewProduct: Product
}

type ProductUpdatePlan = {
  Added: Product[]
  NoChanges: Product[]
  Updated: ProductPair[]
  Deleted: Product[]
}

// Pseudo database
let database: Product[] = [
  { ID: "coffee", Price: 800 },
  { ID: "apple", Price: 100 },
  { ID: "banana", Price: 60 },
  { ID: "milk", Price: 150 },
  { ID: "bread", Price: 200 },
  { ID: "cheese", Price: 400 },
  { ID: "tomato", Price: 70 },
  { ID: "lettuce", Price: 80 },
  { ID: "cucumber", Price: 60 },
  { ID: "chicken breast", Price: 900 },
  { ID: "ground beef", Price: 700 },
  { ID: "pasta", Price: 160 },
  { ID: "rice", Price: 125 },
  { ID: "canned beans", Price: 130 },
  { ID: "cereal", Price: 250 },
  { ID: "peanut butter", Price: 350 },
  { ID: "jam", Price: 300 },
  { ID: "flour", Price: 100 },
  { ID: "sugar", Price: 90 },
  { ID: "eggs", Price: 200 },
  { ID: "orange juice", Price: 250 },
  { ID: "water bottle", Price: 50 },
]

// CSV Parser
const parseCSV = (csv: string): Product[] => {
  return csv
    .split("\n")
    .slice(1)
    .map((row) => {
      const [ID, Price] = row.split(",")
      return { ID, Price: parseInt(Price, 10) }
    })
}

// Create Plan
const createPlan = (
  oldProducts: Product[],
  newProducts: Product[],
): ProductUpdatePlan => {
  let plan: ProductUpdatePlan = {
    Added: [],
    NoChanges: [],
    Updated: [],
    Deleted: [],
  }
  let oldProductMap = new Map<string, Product>()
  oldProducts.forEach((product) => oldProductMap.set(product.ID, product))

  newProducts.forEach((product) => {
    const oldProduct = oldProductMap.get(product.ID)
    if (!oldProduct) {
      plan.Added.push(product)
    } else if (oldProduct.Price !== product.Price) {
      plan.Updated.push({ OldProduct: oldProduct, NewProduct: product })
    } else {
      plan.NoChanges.push(product)
    }
  })

  oldProducts.forEach((product) => {
    if (!newProducts.find((p) => p.ID === product.ID)) {
      plan.Deleted.push(product)
    }
  })

  return plan
}

const formatPrice = (price: number) => {
  return (price / 100).toFixed(2)
}

const ProductDetails = ({ product }: { product: Product }) => (
  <div className="flex">
    <div className="w-40 truncate">{product.ID}</div>
    <div>{formatPrice(product.Price)}</div>
  </div>
)

// Component to render updated product details
const UpdatedProductDetails = ({ pair }: { pair: ProductPair }) => (
  <div className="flex">
    <div className="w-40 truncate">{pair.NewProduct.ID}</div>
    <div>
      {formatPrice(pair.OldProduct.Price)} ➔{" "}
      {formatPrice(pair.NewProduct.Price)}
    </div>
  </div>
)

// React Component
const StoreExample: React.FC = () => {
  const [csvData, setCsvData] = useState(
    `
product_id,price_in_cent
coffee,800
apple,100
banana,50
milk,150
bread,200
cheese,400
tomato,80
lettuce,90
cucumber,70
chicken breast,900
ground beef,800
pasta,150
canned beans,130
cereal,250
jam,300
flour,100
sugar,90
eggs,200
orange juice,250
water bottle,50
salt,100
pepper,100
`.trim(),
  )
  const [updatePlan, setUpdatePlan] = useState<ProductUpdatePlan | null>(null)

  const handlePreview = () => {
    const products = parseCSV(csvData)
    const plan = createPlan(database, products)
    setUpdatePlan(plan)
  }

  const handleApply = () => {
    if (!updatePlan) return
    // Apply the update plan to the pseudo database
    database = [
      ...database.filter(
        (prod) => !updatePlan.Deleted.find((del) => del.ID === prod.ID),
      ),
      ...updatePlan.Added,
      ...updatePlan.Updated.map((upd) => upd.NewProduct),
    ]
    setUpdatePlan(null) // Clear the update plan after applying
  }

  return (
    <div>
      <h3 className="text-lg mb-2">Products in the database</h3>
      <div className="p-4 bg-black text-gray-300 h-72 overflow-scroll">
        <div className="flex">
          <div className="w-40">ID</div>
          <div>Price</div>
        </div>
        {database.map((product) => (
          <ProductDetails key={product.ID} product={product} />
        ))}
      </div>
      <h4 className="text-lg mb-2 mt-4">CSV Data</h4>
      <textarea
        className="bg-black text-gray-300 p-4"
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
        placeholder="Enter CSV data here"
        rows={10}
        style={{ width: "100%" }}
      />
      <div className="gap-4 flex">
        <div>
          <button className="bg-yellow-400 px-4 py-2" onClick={handlePreview}>
            Preview Update Plan
          </button>
        </div>
      </div>
      <h4 className="text-lg mt-4 mb-2">Update Plan</h4>
      {!updatePlan && <div>No update plan available</div>}
      {updatePlan && (
        <div>
          <div className="p-4 bg-black text-gray-300">
            <div>
              <strong>Added: </strong>
              <div className="ml-4">
                {updatePlan.Added.map((product) => (
                  <ProductDetails key={product.ID} product={product} />
                ))}
                {updatePlan.Added.length === 0 && "None"}
              </div>
            </div>
            <div>
              <strong>No Changes: </strong>
              <div className="ml-4">
                {updatePlan.NoChanges.map((product) => (
                  <ProductDetails key={product.ID} product={product} />
                ))}
                {updatePlan.NoChanges.length === 0 && "None"}
              </div>
            </div>
            <div>
              <strong>Updated: </strong>
              <div className="ml-4">
                {updatePlan.Updated.map((pair) => (
                  <UpdatedProductDetails key={pair.NewProduct.ID} pair={pair} />
                ))}
                {updatePlan.Updated.length === 0 && "None"}
              </div>
            </div>
            <div>
              <strong>Deleted: </strong>
              <div className="ml-4">
                {updatePlan.Deleted.map((product) => (
                  <ProductDetails key={product.ID} product={product} />
                ))}
                {updatePlan.Deleted.length === 0 && "None"}
              </div>
            </div>
          </div>
          <button
            className="bg-yellow-400 px-4 py-2 mt-2 disabled:bg-gray-300"
            onClick={handleApply}
            disabled={!updatePlan}
          >
            Apply Update Plan
          </button>
        </div>
      )}
    </div>
  )
}

const Home: NextPage = () => {
  return (
    <Container activeId="blog">
      <h2 className="text-3xl mb-4">
        {"Safe guarding changes using update plans"}
      </h2>
      <div className="flex gap-1">
        <address>
          By{" "}
          <a
            className="link"
            rel="author"
            href="https://www.linkedin.com/in/tom-nick/"
          >
            Tom Nick
          </a>
        </address>
        {" on "}
        <time dateTime="2024-02-26" title="February 26th, 2024">
          2024-02-26
        </time>
      </div>
      <p className="my-4">
        At the company I’m currently working at, we have a lot of business
        critical manual data imports e.g. a customer provided CSV file that we
        want to import into our database and that affects business operations. A
        great way to improve the safety of these changes is to use update plans.
      </p>
      <h3 className="text-xl mt-8">What are update plans?</h3>
      <p className="my-4">
        If you know terraform, you already know update plans. Terraform is a
        tool that is used to manage infrastructure using a declarative
        programming language. Changing infrastructure is extremely delicate,
        removing one line of code and the production server could be deleted. To
        safeguard changing this, an infrastructure update is typically done like
        this:
      </p>
      <ol className="my-4 ml-4">
        <li>
          The developer changes the infrastructure code as they desire, e.g.
          increasing the memory of a server from 8 to 16 GB.
        </li>
        <li>
          The developer executes "terraform plan". This command will compare the
          wanted changes to what is currently active. The result is a plan on
          “how move the current state to the desired state”.
        </li>
        <li>The developer verifies that the changes look sound.</li>
        <li>
          The developer executes "terraform apply" to actually apply the
          changes.
        </li>
      </ol>
      <p>
        The powerful safeguard is that terraform doesn’t go ahead and just
        applies the changes, but first creates a plan on how to transform the
        current state to the desired one and allow the user to only act on that
        plan. This way, the developer can verify that the changes look good and
        would immediately catch if their changes have more effects than wanted.
        (For terraform this not perfect sadly, there are often “noise” changes
        due to e.g. AWS api changes etc.).
      </p>
      <h3 className="text-xl mt-8">Update plans for database changes</h3>
      <p className="my-4">
        Not every update is as important as updating your infrastructure and
        needs an explicit plan & apply step. But the pattern to split important
        changes in an plan & apply step is useful not only in infrastracture
        management, but in all cases where one can preview a the final changes
        will look like. Database updates fit this very well and I will show you
        how this can look like.
      </p>
      <p className="my-4">
        An example, say you are working on the system for a supermarket chain
        and the prices for each product are shown on a tiny screen that is
        controlled by a centralized server which gets the prices from a
        database. The prices are updated quite often and it is still a manual
        process by providing a CSV file with two columns: product_id,price.
        Let’s model this update with an update plan. First we define our product
        data model, simple ID & price combination, before people scream that one
        should never use a float for a monetary value, we use an int (normally
        you’d want to use a decimal).
      </p>
      <CodeBlock language="go">
        {`
type Product struct {
	ID    string
	Price int
}
`}
      </CodeBlock>
      <p className="my-4">
        Then we define how our ProductPlan is supposed to look like. Our update
        plan has
      </p>
      <ul className="ml-4 my-4">
        <li>
          Added - products that are only in the new dataset and thus will be
          added
        </li>
        <li>
          NoChanges - products that are both in the old and new dataset, but the
          price did not change
        </li>
        <li>
          Updated - products that are both in the old and new dataset, but the
          price changed
        </li>
        <li>
          Removed - products that are only in the old dataset and thus will be
          removed
        </li>
      </ul>
      <CodeBlock language="go">
        {`
type ProductPair struct {
	OldProduct Product
	NewProduct Product
}

type ProductUpdatePlan struct {
	Added     []Product
	NoChanges []Product
	Updated   []ProductPair
	Deleted   []Product
}
`}
      </CodeBlock>
      <p className="my-4">
        The create plan then can look as follows. The cool thing here is that
        it’s a pure function, it has no side effects and doesn’t even return an
        error. It’s very easy to test this.
      </p>
      <CodeBlock language="go">
        {`
func CreatePlan(oldProducts []Product, newProducts []Product) ProductUpdatePlan {
	plan := ProductUpdatePlan{}
	oldProductMap := make(map[string]Product)
	for _, product := range oldProducts {
		oldProductMap[product.ID] = product
	}
	newProductMap := make(map[string]Product)
	for _, product := range newProducts {
		oldProduct, ok := oldProductMap[product.ID]
		if !ok {
			plan.Added = append(plan.Added, product)
		} else if oldProduct.Price != product.Price {
			plan.Updated = append(plan.Updated, ProductPair{OldProduct: oldProduct, NewProduct: product})
		} else {
			plan.NoChanges = append(plan.NoChanges, product)
		}
		newProductMap[product.ID] = product
	}

	for _, product := range oldProducts {
		_, ok := newProductMap[product.ID]
		if !ok {
			plan.Deleted = append(plan.Deleted, product)
		}
	}

	return plan
}
`}
      </CodeBlock>
      <p className="my-4">
        To actually apply these changes, we define an interface, that will
        represent the database. We keep it simple and do not use any batch
        updates / inserts here.
      </p>
      <CodeBlock language="go">
        {`
type repo interface {
	InsertProduct(product Product) error
	UpdateProduct(product Product) error
	DeleteProduct(product Product) error
	GetProducts() ([]Product, error)
}

func (pup ProductUpdatePlan) Apply(repo) error {
	for _, product := range pup.Added {
		err := repo.InsertProduct(product)
		if err != nil {
			return err
		}
	}
	for _, productPair := range pup.Updated {
		err := repo.UpdateProduct(productPair.NewProduct)
		if err != nil {
			return err
		}
	}
	for _, product := range pup.Deleted {
		err := repo.DeleteProduct(product)
		if err != nil {
			return err
		}
	}
	return nil
}
`}
      </CodeBlock>
      <p className="my-4">
        The overall flow could look like this - this could be the function an
        endpoint would call, the preview flag controls if it’s just a preview or
        the actual import.
      </p>
      <CodeBlock language="go">
        {`
func UpdateProducts(repo repo, csv string, preview bool) (ProductUpdatePlan, error) {
	// Implementing parseCSV is left as an exercise for the reader.
	products, err := parseCSV(csv)
	if err != nil {
		return err
	}
	oldProducts, err := repo.GetProducts()
	if err != nil {
		return err
	}
	plan := CreatePlan(oldProducts, products)
	if preview {
		return plan, nil
	}

	return plan, plan.Apply(repo)
}
`}
      </CodeBlock>
      <p className="my-4">
        With this, we can offer a user experience that feels safe and
        predictable. The user can clearly see how their changes will interact
        with the system.
      </p>
      <h3 className="text-xl mt-8">Interactive example</h3>
      <p className="my-4">
        To have an excuse that this blog is built with React.js, here is an
        interactive example of how this could look like. You can provide a CSV
        with products and see the update plan. You can then apply the update
        plan to the database. The products and CSV are seeded with some sensible
        data.
      </p>
      <div className="p-4 bg-gray-200">
        <StoreExample />
      </div>
      <h3 className="text-xl mt-8">
        Why do normal databases not implement this?
      </h3>
      <p className="my-4">
        I really would like this to be a first class citizen in databases as
        this pattern is useful in a lot of occasions. Most databases already
        have transactions, where you can safely make updates to a database and
        either commit or abort all the changes one made. If the database would
        then allow me to see the final result of said transaction - which tables
        will be affected and how - that would make adding an update plan an
        extremely simple task. I don't know enough about the internals of
        databases to know why this is not a thing. I’d love to hear from someone
        who knows more.
      </p>
    </Container>
  )
}

export default Home
