import { cmpPos } from "codemirror"

const btns = {
  delete: (h, params, vm) => {
    return h('Poptip', {
      style: {
        cursor: 'pointer',
        marginRight: '5px'
      },
      props: {
        confirm: true,
        title: '你确定要删除吗?',
      },
      directives: [
        {
          // name: 'button_access',
          button_value: 'delete',
          access: params.row.buttonAccess,
        }
      ],
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params)
          vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('Button', {
        style: {
          cursor: 'pointer',
          marginRight: '5px'
        },
        props: {
          type: 'error',
          size: 'small'
          // ghost: true
        }
      }, '删除')
    ])
  },
  edit: (h, params, vm) => {
    return h('Button', {
      style: {
        cursor: 'pointer',
        marginRight: '5px'
      },
      directives: [
        {
          // name: 'button_access',
          button_value: 'edit',
          access: params.row.buttonAccess,
        }
      ],
      props: {
        type: 'primary',
        size: 'small'
      },
      on: {
        'click': () => {
          vm.$emit('on-edit', params)
        }
      }
    }, '编辑')
  },
  editRow: (h, params, vm) => {
    return h('Button', {
      style: {
        cursor: 'pointer',
        marginRight: '5px'
      },
      directives: [
        {
          // name: 'button_access',
          button_value: 'editRow',
          access: params.row.buttonAccess,
        }
      ],
      props: {
        type: !(vm.edittingCellId === `editting-${params.index}`) ? 'primary' : 'success',
        size: 'small'
      },
      on: {
        'click': () => {
          if (!vm.isRowEditing) {
            // 点击编辑按钮 出现取消按钮
            // console.log(vm.insideColumns[vm.insideColumns.length - 1].options.push('edit'))
            // vm.insideColumns[vm.insideColumns.length - 1].options.push('edit')
            // 正在编辑
            // select 赋值
            vm.isRowEditing = true
            vm.edittingCellId = `editting-${params.index}`
            vm.$emit('on-start-edit', params)
          } else {
            // 保存
            // select赋值
            params.selectValue = vm.edittingSelect
            vm.edittingSelect = []

            vm.isRowEditing = false
            vm.edittingCellId = ''
            vm.isRowEditSave = true

            vm.$emit('on-save-edit-row', params)
          }
        }
      }
    }, !(vm.edittingCellId === `editting-${params.index}`) ? '编辑' : '保存')
  },
  approve: (h, params, vm) => {
    return h('Button', {
      style: {
        cursor: 'pointer',
        marginRight: '5px'
      },
      directives: [
        {
          // name: 'button_access',
          button_value: 'approve',
          access: params.row.buttonAccess,
        }
      ],
      props: {
        type: 'primary',
        size: 'small'
      },
      on: {
        'click': () => {
          vm.$emit('on-approve', params)
        }
      }
    }, '审批')
  },
  view: (h, params, vm) => {
    return h('Button', {
      style: {
        cursor: 'pointer',
        marginRight: '5px'
      },
      directives: [
        {
          // name: 'button_access',
          button_value: 'view',
          access: params.row.buttonAccess,
        }
      ],
      props: {
        type: 'primary',
        size: 'small'
      },
      on: {
        'click': () => {
          vm.$emit('on-view', params)
        }
      }
    }, '查看')
  },
  cancelApprove: (h, params, vm) => {
    return h('Button', {
      style: {
        cursor: 'pointer',
        marginRight: '5px'
      },
      directives: [
        {
          // name: 'button_access',
          button_value: 'cancelApprove',
          access: params.row.buttonAccess,
        }
      ],
      props: {
        type: 'primary',
        size: 'small'
      },
      on: {
        'click': () => {
          vm.$emit('on-cancelApprove', params)
        }
      }
    }, '取消提交')
  },
  cancel: (h, params, vm) => {
    return h('Button', {
      style: {
        cursor: 'pointer',
        marginRight: '5px'
      },
      props: {
        type: 'primary',
        size: 'small'
      },
      on: {
        'click': () => {
          // console.log(h, params, vm)
          vm.isRowEditing = false
          vm.edittingCellId = ""
          vm.$emit('on-cancel', params)
        }
      }
    }, '取消')
  },
}

export default btns
