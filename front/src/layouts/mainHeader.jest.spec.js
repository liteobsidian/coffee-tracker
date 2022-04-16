import { mount, createLocalVue } from '@vue/test-utils'
import HEADER from '@layouts/MainHeader'
import { systemLogout } from '@mixins'
import * as All from 'quasar'
const { Quasar } = All

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key]
  if (val && val.component && val.component.name != null) {
    object[key] = val
  }
  return object
}, {})

describe('Mount Header', () => {
  const localVue = createLocalVue()
  localVue.mixin(systemLogout)
  localVue.use(Quasar, { components }) // , lang: langEn

  const wrapper = mount(HEADER, {
    localVue,
    mocks: {
      import: () => {return false},
      systemLogout: () => {return false}
    }
  })
  const vm = wrapper.vm

  it('has a created hook', () => {
    expect(typeof vm.increment).toBe('function')
  })

  it('accesses the shallowMount', () => {
    expect(vm.$el.textContent).toContain('rocket muffin')
    expect(wrapper.text()).toContain('rocket muffin') // easier
    expect(wrapper.find('p').text()).toContain('rocket muffin')
  })

  it('sets the correct default data', () => {
    expect(typeof vm.counter).toBe('number')
    const defaultData2 = HEADER.data()
    expect(defaultData2.counter).toBe(0)
  })

  it('correctly updates data when button is pressed', async () => {
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(vm.counter).toBe(1)
  })
})
