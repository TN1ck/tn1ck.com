import type { NextPage, Metadata } from "next"
import Link from "next/link"
import Container from "../../components/container"
import { CodeBlock } from "../../components/code-block"

import React, { useState } from "react"
import { Author, BlogContent } from "../../components/blog"
import { Card } from "../../components/card"
import { Footnote } from "../../components/footnote"
import Head from "next/head"

export const metadata = {
  title: "Safeguarding changes using the plan-execute pattern",
  description:
    "The plan-execute pattern is a way to preview changes before they are applied. This blog post shows how to use this pattern for database updates.",
  date: "2024-02-26",
  slug: "update-plans",
}

/* eslint-disable react/no-unescaped-entities */

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
    <div className="grid sm:grid-cols-2 gap-4 grid-cols-1">
      <div>
        <div>
          <Card title="Products in the database" bgColor="bg-gray-200">
            <div className="p-4 bg-gray-200 text-black h-72 overflow-scroll">
              <div className="flex">
                <div className="w-40">ID</div>
                <div>Price</div>
              </div>
              {database.map((product) => (
                <ProductDetails key={product.ID} product={product} />
              ))}
            </div>
          </Card>
        </div>
        <div className="mt-4">
          <Card title="CSV Data (you can change me!)" bgColor="bg-gray-200">
            <textarea
              className="bg-white text-black p-4 h-72"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Enter CSV data here"
              rows={10}
              style={{ width: "100%" }}
            />
            <div className="flex justify-between mt-2">
              <button
                className="bg-orange-200 hover:bg-orange-300 px-4 py-2 rounded-md"
                onClick={handlePreview}
              >
                Preview
              </button>
              <button
                className="bg-orange-200 hover:bg-orange-300 px-4 py-2 disabled:bg-gray-300 rounded-md"
                onClick={handleApply}
                disabled={!updatePlan}
              >
                Execute
              </button>
            </div>
          </Card>
        </div>
      </div>
      <div>
        <div>
          <Card title="Update Plan" bgColor="bg-gray-200">
            {!updatePlan && (
              <div className="text-gray-600">No update plan available.</div>
            )}
            {updatePlan && (
              <div className="mt-2">
                <div className="p-4 bg-gray-300 text-black">
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
                        <UpdatedProductDetails
                          key={pair.NewProduct.ID}
                          pair={pair}
                        />
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
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

const UpdatePlans: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
        <p className="my-4">
          At the company I’m currently working at, a.k.a.{" "}
          <a href="https://re-cap.com">re:cap</a>, we have some manual data
          imports that are business-critical, e.g., a customer-provided CSV file
          that we want to import into our database and that affects business
          operations. A simple pattern I came to love to make this process fast
          & safe is using the plan-execute pattern.
        </p>
        <h3>What is the plan-execute pattern?</h3>
        <p>
          The plan-execute pattern (or plan-apply pattern) is a way to preview
          changes before they are applied.
        </p>
        <p>
          If you know <a href="https://www.terraform.io/">Terraform</a>, you
          already know the plan-execute pattern. Terraform is a tool that is
          used to manage infrastructure using a declarative programming
          language. Changing infrastructure is extremely delicate, remove one
          line of code, and the production server could be deleted, increasing
          the avg. heart rate of the team by 50 BPM. To safeguard our servers
          and heart rates, an infrastructure update is typically done with the
          following steps:
        </p>
        <ol className="blog">
          <li>
            The developer changes the infrastructure code as they desire, e.g.,
            increasing the memory of a server from 8 to 16 GB.
          </li>
          <li>
            The developer executes the command "terraform plan". This will
            compare the wanted changes to what is currently active. The result
            is a plan on “how to move the current state to the desired state”.
          </li>
          <li>The developer verifies that the changes look sound.</li>
          <li>
            The developer executes "terraform apply" to actually execute the
            changes.
          </li>
        </ol>
        <p>
          The key safeguard is that Terraform doesn’t directly execute the
          changes but first creates a plan to transition the current state to
          the desired one, allowing the user to review and approve the plan.
          This ensures that the developer can verify the changes are as
          intended, catching any undesired effects early.
          <Footnote>
            For Terraform, this is not perfect, sadly. There are often “noise”
            changes due to e.g., AWS API changes etc., that actually don’t
            change anything. And this is actually a difficult part of writing
            update plans - to correctly assess an "update" and a "no change".
          </Footnote>
        </p>
        <p>Some more examples:</p>
        <ul className="blog">
          <li>
            Checkout pages use the plan-execute pattern - they show you what
            you’ll buy, the amount of money to be deducted, where to send it,
            etc. One can read through all this before hitting the "buy" (or
            rather "execute") button.
          </li>
          <li>
            A git diff is a plan-execute pattern - it shows you the changes that
            you are about to commit.
          </li>
          <li>
            A file deletion dialog is a plan-execute pattern - it often shows
            how many files will be deleted and asks you to confirm.
          </li>
        </ul>
        <h3>Plan-execute pattern for database changes</h3>
        <p>
          Not every update is as important as updating your infrastructure and
          needs an explicit plan & execute step. But the pattern to split
          important changes into a plan & execute step is useful not only in
          infrastructure management but in all cases where one can preview what
          the final changes will look like. Database updates fit this very well,
          and I will show you how this can look like.
        </p>
        <p>
          An example: say you are working on the system for a supermarket chain
          and the prices for each product are shown on a tiny screen that is
          controlled by a centralized server, which gets the prices from a
          database. The prices are updated quite often, but sadly still in a
          manual way as the supermarkets’ fast paced environment never allowed
          them to address tech debt. To update the prices, someone has to upload
          a CSV file with two columns: product_id, price. Let’s model this with
          a plan-execute pattern to make sure that the price for frozen pizza is
          always correct. I’ll use Go in the following code examples.
        </p>
        <p>
          First, we define our product data model: a simple ID & price
          combination. Before people scream that one should never use a float
          for a monetary value, we will use an int that represents "money" in
          cents.
          <Footnote>
            And you should never, I’ll haunt you personally. Floats are not
            precise enough for monetary values or anything really where
            precision is important. I find that representing money as fraction
            of a cent is a decent way (e.g. stripes API does this), normally I
            use a decimal type, those are sadly not built into programming
            languages, but there are libraries e.g. in Go there is the{" "}
            <a
              rel="nofollow"
              target="_blank"
              href="https://github.com/shopspring/decimal"
            >
              github.com/shopspring/decimal
            </a>{" "}
            package, JavaScript has the{" "}
            <a href="https://github.com/MikeMcl/big.js">big.js</a> package.
          </Footnote>
        </p>
        <CodeBlock language="go" className="md:-mx-8  md:px-8 -mx-4">
          {`
type Product struct {
	ID    string
	Price int
}
`}
        </CodeBlock>
        <p>
          Then we define how our ProductPlan is supposed to look. Our update
          plan has:
        </p>
        <ul className="blog">
          <li>
            <strong>Added</strong> - products that are only in the new dataset
            and thus will be added.
          </li>
          <li>
            <strong>NoChanges</strong> - products that are both in the old and
            new datasets, but the price did not change.
          </li>
          <li>
            <strong>Updated</strong> - products that are both in the old and new
            datasets, but the price changed.
          </li>
          <li>
            <strong>Removed</strong> - products that are only in the old dataset
            and thus will be removed.
          </li>
        </ul>
        <CodeBlock language="go" className="md:-mx-8  md:px-8 -mx-4">
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
        <p>
          The CreatePlan function then can look as follows. The cool thing here
          is that it’s a pure function; it has no side effects and doesn’t even
          return an error. It’s very easy to test this.
        </p>
        <CodeBlock language="go" className="md:-mx-8  md:px-8 -mx-4">
          {`
func CreatePlan(
	oldProducts []Product, newProducts []Product,
) ProductUpdatePlan {
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
			plan.Updated = append(plan.Updated, ProductPair{
				OldProduct: oldProduct,
				NewProduct: product,
			})
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
        <p>
          To actually execute these changes, we define an interface that will
          represent the database. We keep it simple and do not use any batch
          updates/inserts here.
        </p>
        <CodeBlock language="go" className="md:-mx-8  md:px-8 -mx-4">
          {`
type Repo interface {
	InsertProduct(product Product) error
	UpdateProduct(product Product) error
	DeleteProduct(product Product) error
	GetProducts() ([]Product, error)
	Transaction(func(repo Repo) error) error
}

func (pup ProductUpdatePlan) Execute(repo Repo) error {
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
        <p>
          The overall flow could look like this - this could be the function an
          endpoint would call; the preview flag controls if it’s just a preview
          or the actual import.
        </p>
        <CodeBlock language="go" className="md:-mx-8  md:px-8 -mx-4">
          {`
func UpdateProducts(
	repo repo, csv string, preview bool
) (ProductUpdatePlan, error) {
	// Implementing parseCSV is left as an exercise for the reader.
	products, err := parseCSV(csv)
	if err != nil {
		return ProductUpdatePlan{}, err
	}
  
  var plan ProductUpdatePlan
  err = repo.Transaction(func(repo Repo) error {
    oldProducts, err := repo.GetProducts()
    if err != nil {
      return ProductUpdatePlan{}, err
    }
    plan = CreatePlan(oldProducts, products)
    if preview {
      nil
    }
	  return plan.Execute(repo)
  })

  return plan, err
}
`}
        </CodeBlock>
        <p>
          With this, we can offer a user experience that feels safe and
          predictable. The user can clearly see how their changes will interact
          with the system.
        </p>
        <h3>Interactive example</h3>
        <p>
          To have an excuse for building this blog with React.js, here is an
          interactive toy example of how this could look. You can change the
          provided CSV data, click "Preview changes" and see the update plan.
          You can then execute the update plan to the database by clicking
          "Execute changes". The products and CSV data are seeded with some
          sensible data. There is no error handling, you have to rely on the
          plan-execute pattern for the safeguarding ;).
        </p>
        <div className="p-4 bg-gray-200 md:-mx-8 md:px-8 -mx-4">
          <StoreExample />
        </div>
        <h3>State changes between preview & execute</h3>
        <p>
          A fundamental problem with the plan-execute pattern is that the state
          can change between preview and execute.{" "}
          <Footnote>
            Thanks for the folks at{" "}
            <a href="https://www.reddit.com/r/golang/comments/1e5q4e6/safeguarding_changes_using_the_planexecute_pattern/">
              /r/golang
            </a>{" "}
            to point this out.
          </Footnote>{" "}
          This is especially true for systems that have a lot of concurrent
          users. E.g., if you preview a price change for a product, and in the
          meantime, someone else changes the price, the preview is not valid
          anymore. This is a problem that is hard to solve in a general way and
          is often solved by locking the resource, which can lead to other
          problems. But directly executing the changes without a preview is also
          not a good solution, as it can lead to unexpected results.
          <br />
          Most plan-execute patterns do not require that the state is{" "}
          <i>exactly</i> the same between preview and execute e.g. a file delete
          dialog will not stop deleting files because someone already deleted
          one of them. Terraform will not stop applying changes because someone
          else applied a change in the meantime (it does have its own locking
          mechanism though). It's more about giving the user a way to see what
          will happen and then execute that plan, making sure that the updates
          make sense, e.g. preventing the user from accidentally deleting their
          production database.
        </p>
        <h3>When should one use the plan-execute pattern?</h3>
        <p>
          This pattern does not make sense for most data updates; as this
          entails more work and complexity. It makes sense when:
        </p>
        <ul className="blog">
          <li>
            You’re updating something that is hard to grasp, but doing the
            update creates immediate negative effects.
          </li>
          <li>The updates matter, and it’s not trivial to revert them.</li>
          <li>
            It would help the user be more confident and be faster in checking
            that what they are about to do is correct, e.g., wouldn’t it be nice
            if email clients would tell you how many people you are about to
            send an email to if you are sending it to a group?
          </li>
          <li>
            Either locking the resource is ok, state changes between preview and
            execute are acceptable or it's ok to deny execution if the state
            changed between plan & execute (E.g. the delete file dialog would
            refuse to execute if one of the affected file got deleted in the
            meantime).
          </li>
        </ul>
        <h3>Snapshots & undo</h3>
        <p>
          The plan-execute pattern does not prevent a faulty update from being
          applied, so it is important as well that there is an undo option.
          Sometimes this is not completely possible - e.g., when Terraform
          deletes your production database, you can’t just "undo" that.
          <Footnote>
            If you manage your AWS database using Terraform, please make sure
            you have "skip_final_snapshot" set to false as deleting a database
            also deletes the backups. Ask me how I know that.
          </Footnote>
          But in many cases, it is possible. E.g. snapshot the database before
          the update and then revert to that snapshot if the update was faulty.
        </p>
        <p>
          Some update plans can actually be used to implement this feature,
          e.g., git commits are exactly that. Git commits are update plans that
          you can freely undo and redo.
          <Footnote>
            Git’s UX is just a bit lacking; while it is easy enough to undo a
            commit, it becomes much harder to undo e.g. a rebase. Git reflog
            exists, but it’s not a user friendly interface.
          </Footnote>
          This works only so long as <i>all</i> changes to the system are made
          through the update plans, so for most systems, this is not feasible.
        </p>
        <h3>Why is this not a database feature already?</h3>
        <p>
          Personally I'm using this feature mostly with database updates and
          would really like this to be a first class citizen from them. I asked{" "}
          <a href="https://reddit.com/r/Database">/r/Database</a> if anybody
          knows of some database features that could enable something like this.{" "}
          <a href="https://old.reddit.com/r/Database/comments/1b0u6vu/are_there_databases_that_can_emit_exactly_which/">
            Here
          </a>{" "}
          is the thread if you are interested, my conclusion:
        </p>
        <ul className="blog">
          <li>
            <a href="https://github.com/dolthub/dolt">DoltDB</a> basically
            supports this OOTB with its ability to create branches and native
            diff support. I find this project extremely intriguing personally,
            effortlessly creating snapshots is a game changer (I'm not
            affiliated with them).{" "}
          </li>
          <li>
            Traditional databases do not have good support for this use case,
            CDC was suggested multiple times, but that only helps you{" "}
            <i>after</i> the commit. One could do scd2 (append only, you can
            query any version of the data) or something similar (append only,
            but clean up afterwards). This moves the complexity into the data
            model, which I'm personally not a fan of.
          </li>
        </ul>
        <p>
          For me the application logic approach I showed above is the best for
          me personally as it is agnostic to whatever technology you use to
          actually save the data to and only entails moving around application
          logic.
        </p>
      </BlogContent>
    </Container>
  )
}

export default UpdatePlans
