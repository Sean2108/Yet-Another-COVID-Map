import { mount, createLocalVue } from "@vue/test-utils";
import News from "../../src/components/News.vue";
import Vuetify from "vuetify";

describe("News.vue", () => {
  let localVue;
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
  });

  it("should not have list items if news is empty", () => {
    const wrapper = mount(News, {
      localVue,
      propsData: { news: [], height: "" }
    });
    expect(wrapper.vm.getStyle).toEqual("");
    expect(wrapper.find(".news-card").exists()).toBe(false);
  });

  it("should have list items if news is not empty", () => {
    const wrapper = mount(News, {
      localVue,
      propsData: {
        news: [
          {
            title: "test",
            url: "testurl",
            thumbnailUrl: "thumbnail",
            description: "desc"
          },
          {
            title: "test2",
            url: "testurl2",
            thumbnailUrl: "thumbnail2",
            description: "desc2"
          }
        ],
        height: "50"
      }
    });
    expect(wrapper.vm.getStyle).toEqual("max-height:50vh");
    expect(wrapper.findAll(".news-card").length).toEqual(2);
  });
});
