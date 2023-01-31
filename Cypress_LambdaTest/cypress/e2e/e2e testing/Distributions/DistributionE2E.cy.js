describe("Distribution E2E Testing", () => {
  // before(function ()
  // {
  //   cy.fixture("kurator.json").then(function(kuratorData)
  //   {
  //     this.kuratorData = kuratorData;
  //     cy.log(this.kuratorData.email);
  //   });
  //   cy.login(this.kuratorData.email,this.kuratorData.password);
  //   cy.changeOrg(this.kuratorData.orgName);
  // })

  let activationText;
  before(function () {
    cy.fixture("kurator.json").then((kuratorData) => {
      this.kuratorData = kuratorData;
      // cy.window().then(() =>
      // {
      //   localStorage.setItem("jwt", this.kuratorData.jwt);
      //   localStorage.setItem("tenant.id", this.kuratorData.tenant_id);
      // });
      // cy.visit("https://admin-staging.sourcesync.io/#/");
    });
    cy.login("sourcedev@gmail.com", "Source0ne");
    cy.changeOrg("Cypress Testing");
  });

  it("click to Distribution Tab", function () {
    cy.log(this.kuratorData.email);
    cy.intercept("/currentuser/distributions?*").as("fetchDistributions");
    cy.contains("div", "Distributions").click();
    cy.wait("@fetchDistributions");
  });

  it("create/click new SAM", function () {
    // cy.get(`.q-page [role='img']`).contains('add').trigger('click');
    // cy.intercept('/distributions/count?*').as('fetchCountOfDistributions');
    // cy.get('.q-form').within(()=>
    // {
    //     cy.get(`label > div`).eq(0).type('distribution e2e');
    // })
    //     cy.wait('@fetchCountOfDistributions').then((interceptor)=>
    //     {
    //         expect(interceptor.response.body).to.equal(0,'SAM should be unique.');
    //         cy.get('.q-form').within(()=>
    //         {
    //             cy.get(`label > div`).eq(3).click();
    //         })
    //         cy.contains('div','overlay').click();
    //         cy.intercept('POST','/distributions').as('distributionCreated');
    //         cy.intercept('/distributions/*').as('distributionOpen');
    //         cy.get('.block').contains('Submit').click();
    //         cy.wait('@distributionCreated').then(()=>
    //         {
    //             cy.wait('@distributionOpen');
    //         })
    //     })
    cy.intercept("/distributions/*").as("distributionOpen");
    cy.intercept("/currentuser/tags?*").as("fetchTags");
    cy.get(".q-table__grid-content div.q-card").eq(1).click();
    cy.wait("@distributionOpen").then(() => {
      cy.wait("@fetchTags");
    });
  });

  // it('click on Edit Timeline and add Activation',function()
  // {
  //     cy.intercept('/distributions/*').as('openTimeline');
  //     cy.contains('span','Edit Timeline').click();
  //     cy.wait('@openTimeline').then(()=>
  //     {
  //         cy.contains('span','Add').click();
  //         cy.intercept('/currentuser/activations/count?*').as('fetchCount');
  //         cy.intercept('/currentuser/activations?*').as('fetchActivations');
  //         cy.contains('div','Existing SAMs').click();
  //         cy.wait('@fetchCount').then(()=>
  //         {
  //             cy.wait('@fetchActivations').then(()=>
  //             {
  //                 cy.get("table .q-virtual-scroll__content tr").eq(0).find('td > div').eq(2).then(($text)=>
  //                 {
  //                     activationText = $text.text().trim()
  //                 })
  //                 cy.log(activationText)
  //                 cy.get("table .q-virtual-scroll__content tr").eq(0).click('top');
  //                 cy.intercept('/activations?*').as('activationAdd');
  //                 cy.contains('span','Add Selected Items').click();
  //                 cy.wait('@activationAdd').then(()=>
  //                 {
  //                     cy.get("table .q-virtual-scroll__content tr").eq(0).find('td').eq(4).invoke('text'.trim()).should('contains',activationText);
  //                     cy.contains('span','Save').click();
  //                 })
  //             })
  //         })
  //     })
  // })

  it("click on Edit Timeline and add Activation", function () {
    cy.intercept("/distributions/*").as("openTimeline");
    cy.contains("span", "Edit Timeline").click();
    cy.wait("@openTimeline").then(() => {
      cy.get("table .q-virtual-scroll__content tr > td")
        .eq(4)
        .then(($text) => {
          activationText = $text.text().replace(/edit/g, "").trim();
          // cy.log(activationText)
          console.log(typeof activationText);
        });
    });
  });

  // it('open Experience Engine URL and validate activation is displaying',function()
  // {
  //   cy.contains('i','link').invoke('removeAttr', 'target').click();
  //   cy.get('.activation-target > div').each(($element,index,$list)=>
  //   {
  //     cy.get('div.smartblock-display__label > div').text().should('contains','cypress activation');
  //   })
  // })
  // it('select production',function()
  // {
  //   cy.intercept('/currentuser/productions?*').as('fetchProductions');
  //   cy.contains("Select Production").click();
  //   cy.wait('@fetchProductions');
  //   cy.get(".q-table__grid-content .card-hover").within(($el)=>{
  //     cy.log($el)
  //     cy.get(".text-grey div").eq(1).invoke('text');

  //   })
  // })

  it("extract link", function () {
    // cy.log(activationText);

    cy.location().then((loc) => {
      const key = (loc.href.substring(loc.href.indexOf("content") + 8)).replace(/timeline/g, "").trim();

      // cy.log(key);
      
      cy.visit(`https://experience-stg.sourcesync.io/${key}`).then(() => {
        cy.get(".smart-block-list > div").then(($text) => {
          let smartBlockText = $text.text().replace(/touch_app/g, "").trim();

          cy.wrap(smartBlockText).should('eq', activationText)
          cy.log(smartBlockText);
        });
      });
    });
  });
});

//(window.location.href).substring((window.location.href).indexOf('content') + 8);
